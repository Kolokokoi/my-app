const API_URL = process.env.REACT_APP_API_URL || '/api';

const request = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Database request failed');
  return body.data;
};

class Query {
  constructor(table) {
    this.table = table;
    this.params = new URLSearchParams();
  }

  select(columns = '*') { this.params.set('select', columns); return this; }
  eq(column, value) { this.params.set(`eq.${column}`, value); return this; }
  ilike(column, value) { this.params.set(`ilike.${column}`, value); return this; }
  or(value) { this.params.set('or', value); return this; }
  order(column, { ascending = true } = {}) { this.params.set('order', `${column}.${ascending ? 'asc' : 'desc'}`); return this; }
  limit(value) { this.params.set('limit', value); return this; }
  single() {
    return request(`/db/${this.table}?${this.params}`).then((rows) => {
      if (!rows || rows.length !== 1) throw new Error('Expected one database record');
      return { data: rows[0], error: null };
    });
  }
  then(resolve, reject) { return request(`/db/${this.table}?${this.params}`).then((data) => resolve({ data, error: null }), reject); }
}

const createMutation = (table, method, body) => ({
  eq(column, value) {
    return request(`/db/${table}`, { method, body: JSON.stringify({ data: body, filters: { [column]: value } }) })
      .then((data) => ({ data, error: null }));
  },
});

export const db = {
  from(table) {
    return {
      select: (columns) => new Query(table).select(columns),
      insert: (rows) => ({
        select: () => request(`/db/${table}`, { method: 'POST', body: JSON.stringify({ data: rows }) })
          .then((data) => ({ data, error: null })),
      }),
      update: (data) => createMutation(table, 'PATCH', data),
      delete: () => createMutation(table, 'DELETE', null),
    };
  },
  channel() { return { on: () => ({ subscribe: () => ({}) }) }; },
  removeChannel() {},
};

export const approveAccountRequest = (requestId) => request(`/account-requests/${requestId}/approve`, { method: 'POST' });