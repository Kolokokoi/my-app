require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || process.env.API_PORT || 5000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const allowedTables = new Set(['students', 'faculty', 'admins', 'rooms', 'courses', 'class_schedules', 'account_requests']);
const identifier = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

app.use(express.json());

app.post('/api/account-requests/:id/approve', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const requestResult = await client.query('SELECT * FROM account_requests WHERE id = $1 AND status = $2 FOR UPDATE', [req.params.id, 'Pending']);
    if (!requestResult.rows[0]) throw new Error('Pending account request not found');
    const request = requestResult.rows[0];
    const nameParts = request.full_name.trim().split(/\s+/);
    const firstName = nameParts.shift() || request.full_name;
    const lastName = nameParts.join(' ') || 'User';

    if (request.role === 'Student') {
      await client.query(
        'INSERT INTO students (student_id, first_name, last_name, course, year_level) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (student_id) DO NOTHING',
        [request.user_id, firstName, lastName, request.course_or_department, '1']
      );
      const classes = await client.query("SELECT course_title, room_id, schedule_time FROM class_schedules WHERE student_id LIKE 'FAC-%' ORDER BY id LIMIT 3");
      for (const classRow of classes.rows) {
        await client.query(
          'INSERT INTO class_schedules (student_id, course_title, room_id, schedule_time) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          [request.user_id, classRow.course_title, classRow.room_id, classRow.schedule_time]
        );
      }
    } else {
      await client.query(
        'INSERT INTO faculty (id, name, position, status, room_assigned) VALUES ($1, $2, $3, FALSE, NULL) ON CONFLICT (id) DO NOTHING',
        [request.user_id, request.full_name, request.course_or_department]
      );
      const facultyTemplates = [
        ['CS201 - Data Structures and Algorithms', '102', 'Tue, Thu @ 8:00 AM - 9:30 AM'],
        ['IT201 - Database Management Systems', '302', 'Mon, Wed @ 1:00 PM - 2:30 PM'],
        ['CS202 - Web Application Development', '304', 'Fri @ 10:00 AM - 12:00 PM']
      ];
      for (const [courseTitle, roomId, scheduleTime] of facultyTemplates) {
        await client.query(
          'INSERT INTO class_schedules (student_id, course_title, room_id, schedule_time) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          [request.user_id, courseTitle, roomId, scheduleTime]
        );
      }
    }

    const result = await client.query("UPDATE account_requests SET status = 'Approved' WHERE id = $1 RETURNING *", [request.id]);
    await client.query('COMMIT');
    res.json({ data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});

const checkTable = (table) => { if (!allowedTables.has(table)) throw new Error('Unsupported table'); };
const checkColumn = (column) => { if (!identifier.test(column)) throw new Error('Unsupported column'); return `"${column}"`; };

const buildFilters = (query, values) => {
  const clauses = [];
  for (const [key, value] of Object.entries(query)) {
    const match = key.match(/^(eq|ilike)\.(.+)$/);
    if (!match) continue;
    const column = checkColumn(match[2]);
    values.push(match[1] === 'ilike' ? `%${String(value).replace(/%/g, '')}%` : value);
    clauses.push(`${column} ${match[1] === 'ilike' ? 'ILIKE' : '='} $${values.length}`);
  }
  if (query.or) {
    const orClauses = String(query.or).split(',').map((part) => {
      const [column, operator, rawValue] = part.split('.');
      if (operator !== 'ilike') throw new Error('Unsupported OR operator');
      values.push(`%${String(rawValue || '').replace(/%/g, '')}%`);
      return `${checkColumn(column)} ILIKE $${values.length}`;
    });
    clauses.push(`(${orClauses.join(' OR ')})`);
  }
  return clauses.length ? ` WHERE ${clauses.join(' AND ')}` : '';
};

app.get('/api/db/:table', async (req, res) => {
  try {
    checkTable(req.params.table);
    const values = [];
    const fields = req.query.select && req.query.select !== '*' ? req.query.select.split(',').map(checkColumn).join(', ') : '*';
    const order = req.query.order ? req.query.order.split('.') : [];
    const orderSql = order.length ? ` ORDER BY ${checkColumn(order[0])} ${order[1] === 'desc' ? 'DESC' : 'ASC'}` : '';
    const limit = req.query.limit ? ` LIMIT ${Math.max(1, Number.parseInt(req.query.limit, 10))}` : '';
    const result = await pool.query(`SELECT ${fields} FROM "${req.params.table}"${buildFilters(req.query, values)}${orderSql}${limit}`, values);
    res.json({ data: result.rows });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.post('/api/db/:table', async (req, res) => {
  try {
    checkTable(req.params.table);
    const rows = Array.isArray(req.body.data) ? req.body.data : [req.body.data];
    const keys = Object.keys(rows[0]);
    const columns = keys.map(checkColumn);
    const values = rows.flatMap((row) => keys.map((key) => row[key] ?? null));
    const placeholders = rows.map((_, rowIndex) => `(${columns.map((__, columnIndex) => `$${rowIndex * columns.length + columnIndex + 1}`).join(', ')})`).join(', ');
    const result = await pool.query(`INSERT INTO "${req.params.table}" (${columns.join(', ')}) VALUES ${placeholders} RETURNING *`, values);
    res.json({ data: result.rows });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.patch('/api/db/:table', (req, res) => mutate(req, res, 'UPDATE'));
app.delete('/api/db/:table', (req, res) => mutate(req, res, 'DELETE'));

async function mutate(req, res, operation) {
  try {
    checkTable(req.params.table);
    const values = [];
    const filters = Object.fromEntries(Object.entries(req.body.filters || {}).map(([key, value]) => [`eq.${key}`, value]));
    const where = buildFilters(filters, values);
    let sql;
    if (operation === 'UPDATE') {
      const assignments = Object.entries(req.body.data || {}).map(([column, value]) => { values.push(value); return `${checkColumn(column)} = $${values.length}`; });
      sql = `UPDATE "${req.params.table}" SET ${assignments.join(', ')}${where} RETURNING *`;
    } else { sql = `DELETE FROM "${req.params.table}"${where} RETURNING *`; }
    const result = await pool.query(sql, values);
    res.json({ data: result.rows });
  } catch (error) { res.status(400).json({ error: error.message }); }
}

app.use(express.static(path.join(__dirname, 'build')));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => console.log(`Campus Navigator listening on port ${port}`));