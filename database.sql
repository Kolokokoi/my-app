CREATE TABLE IF NOT EXISTS students (
  student_id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  course TEXT,
  year_level TEXT
);

CREATE TABLE IF NOT EXISTS faculty (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  status BOOLEAN NOT NULL DEFAULT FALSE,
  room_assigned TEXT
);

CREATE TABLE IF NOT EXISTS admins (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  full_name TEXT
);

CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Free',
  type TEXT,
  floor INTEGER,
  capacity INTEGER,
  equipment TEXT,
  occupant_name TEXT,
  subject TEXT,
  occupant_id TEXT,
  image_url TEXT,
  time TEXT
);

CREATE TABLE IF NOT EXISTS courses (
  course_code TEXT PRIMARY KEY,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS class_schedules (
  id SERIAL PRIMARY KEY,
  student_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  room_id TEXT,
  schedule_time TEXT
);

CREATE TABLE IF NOT EXISTS account_requests (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('Student', 'Teacher')),
  user_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  institutional_email TEXT NOT NULL,
  course_or_department TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (role, user_id),
  UNIQUE (institutional_email)
);

CREATE UNIQUE INDEX IF NOT EXISTS class_schedules_unique_schedule
  ON class_schedules (student_id, course_title, room_id, schedule_time);

INSERT INTO students (student_id, first_name, last_name, course, year_level)
VALUES ('123-00001', 'Test', 'Student', 'BS Computer Science', '1')
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO students (student_id, first_name, last_name, course, year_level)
VALUES
  ('123-00002', 'Mia', 'Santos', 'BS Information Technology', '1'),
  ('123-00003', 'Liam', 'Reyes', 'BS Computer Science', '2'),
  ('123-00004', 'Ava', 'Cruz', 'BS Information Systems', '3'),
  ('123-00005', 'Noah', 'Garcia', 'BS Computer Science', '4'),
  ('123-00006', 'Sofia', 'Mendoza', 'BS Information Technology', '2'),
  ('123-00007', 'Ethan', 'Navarro', 'BS Information Systems', '1'),
  ('123-00008', 'Isla', 'Bautista', 'BS Computer Science', '3'),
  ('221-02240', 'Ken', 'Avergonzado', 'BS Information Technology', '4'),
  ('123-00010', 'Ella', 'Villanueva', 'BS Information Systems', '2'),
  ('123-00011', 'Caleb', 'Flores', 'BS Computer Science', '1')
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO faculty (id, name, position, status, room_assigned)
VALUES ('FAC-001', 'Prof. Alan Turing', 'Professor', FALSE, NULL)
ON CONFLICT (id) DO UPDATE SET room_assigned = EXCLUDED.room_assigned;

INSERT INTO faculty (id, name, position, status, room_assigned)
VALUES
  ('FAC-002', 'Dr. Ada Lovelace', 'Associate Professor', FALSE, NULL),
  ('FAC-003', 'Engr. Grace Hopper', 'Instructor', FALSE, NULL),
  ('FAC-004', 'Prof. John von Neumann', 'Professor', FALSE, NULL)
ON CONFLICT (id) DO UPDATE SET room_assigned = EXCLUDED.room_assigned;

UPDATE faculty SET room_assigned = '101' WHERE id = 'FAC-001';
UPDATE faculty SET room_assigned = '201' WHERE id = 'FAC-002';
UPDATE faculty SET room_assigned = '202' WHERE id = 'FAC-003';
UPDATE faculty SET room_assigned = '301' WHERE id = 'FAC-004';

INSERT INTO admins (username, password, full_name)
VALUES ('admin', 'admin', 'System Administrator')
ON CONFLICT (username) DO NOTHING;

INSERT INTO rooms (id, name, status, type, floor, capacity, equipment)
VALUES
  ('101', 'Room 101', 'Free', 'CLASSROOM', 1, 40, 'Projector'),
  ('102', 'Room 102', 'Free', 'CLASSROOM', 1, 40, 'Projector'),
  ('201', 'Room 201', 'Free', 'CLASSROOM', 2, 40, 'Projector'),
  ('202', 'Room 202', 'Free', 'LAB', 2, 30, 'Computers'),
  ('301', 'Room 301', 'Free', 'CLASSROOM', 3, 40, 'Projector'),
  ('302', 'Room 302', 'Free', 'CLASSROOM', 3, 40, 'Projector'),
  ('304', 'Room 304', 'Free', 'LAB', 3, 30, 'Computers')
ON CONFLICT (id) DO NOTHING;

UPDATE rooms SET status = 'Free', occupant_id = NULL, occupant_name = NULL, subject = NULL, time = NULL WHERE id IN ('101', '201', '202', '301');

INSERT INTO courses (course_code, description)
VALUES
  ('CS101', 'Introduction to Computer Science'),
  ('IT102', 'Information Technology Fundamentals'),
  ('CS201', 'Data Structures and Algorithms'),
  ('IT201', 'Database Management Systems'),
  ('IS101', 'Systems Analysis and Design'),
  ('CS202', 'Web Application Development')
ON CONFLICT (course_code) DO NOTHING;

INSERT INTO class_schedules (student_id, course_title, room_id, schedule_time)
VALUES
  ('FAC-001', 'CS101 - Introduction to Computer Science', '101', 'Mon, Wed @ 8:00 AM - 9:30 AM'),
  ('FAC-002', 'IT102 - Information Technology Fundamentals', '201', 'Tue, Thu @ 10:00 AM - 11:30 AM'),
  ('FAC-003', 'CS101 - Introduction to Computer Science', '202', 'Mon, Fri @ 1:00 PM - 2:30 PM'),
  ('FAC-004', 'IT102 - Information Technology Fundamentals', '301', 'Wed, Fri @ 3:00 PM - 4:30 PM'),
  ('123-00001', 'CS101 - Introduction to Computer Science', '101', 'Mon, Wed @ 8:00 AM - 9:30 AM'),
  ('123-00002', 'IT102 - Information Technology Fundamentals', '201', 'Tue, Thu @ 10:00 AM - 11:30 AM'),
  ('123-00003', 'CS101 - Introduction to Computer Science', '202', 'Mon, Fri @ 1:00 PM - 2:30 PM'),
  ('123-00004', 'IT102 - Information Technology Fundamentals', '301', 'Wed, Fri @ 3:00 PM - 4:30 PM'),
  ('123-00005', 'CS101 - Introduction to Computer Science', '102', 'Tue, Thu @ 8:00 AM - 9:30 AM'),
  ('123-00006', 'IT102 - Information Technology Fundamentals', '302', 'Mon, Wed @ 10:00 AM - 11:30 AM'),
  ('123-00007', 'CS101 - Introduction to Computer Science', '304', 'Tue, Fri @ 1:00 PM - 2:30 PM'),
  ('123-00008', 'IT102 - Information Technology Fundamentals', '101', 'Mon, Thu @ 3:00 PM - 4:30 PM'),
  ('221-02240', 'CS101 - Introduction to Computer Science', '201', 'Tue, Thu @ 8:00 AM - 9:30 AM'),
  ('123-00010', 'IT102 - Information Technology Fundamentals', '202', 'Wed, Fri @ 10:00 AM - 11:30 AM'),
  ('123-00011', 'CS101 - Introduction to Computer Science', '301', 'Mon, Wed @ 1:00 PM - 2:30 PM')
ON CONFLICT DO NOTHING;

INSERT INTO class_schedules (student_id, course_title, room_id, schedule_time)
VALUES
  ('FAC-001', 'CS201 - Data Structures and Algorithms', '102', 'Tue, Thu @ 8:00 AM - 9:30 AM'),
  ('FAC-001', 'CS202 - Web Application Development', '304', 'Fri @ 10:00 AM - 12:00 PM'),
  ('FAC-002', 'IT201 - Database Management Systems', '302', 'Mon, Wed @ 1:00 PM - 2:30 PM'),
  ('FAC-002', 'IS101 - Systems Analysis and Design', '304', 'Fri @ 1:00 PM - 3:00 PM'),
  ('FAC-003', 'IS101 - Systems Analysis and Design', '102', 'Tue, Thu @ 10:00 AM - 11:30 AM'),
  ('FAC-003', 'CS202 - Web Application Development', '202', 'Fri @ 8:00 AM - 10:00 AM'),
  ('FAC-004', 'CS201 - Data Structures and Algorithms', '201', 'Mon, Wed @ 10:00 AM - 11:30 AM'),
  ('FAC-004', 'IT201 - Database Management Systems', '302', 'Tue, Thu @ 1:00 PM - 2:30 PM'),
  ('123-00001', 'CS201 - Data Structures and Algorithms', '102', 'Tue, Thu @ 8:00 AM - 9:30 AM'),
  ('123-00001', 'CS202 - Web Application Development', '304', 'Fri @ 10:00 AM - 12:00 PM'),
  ('123-00002', 'IT201 - Database Management Systems', '302', 'Mon, Wed @ 1:00 PM - 2:30 PM'),
  ('123-00002', 'IS101 - Systems Analysis and Design', '304', 'Fri @ 1:00 PM - 3:00 PM'),
  ('123-00003', 'IS101 - Systems Analysis and Design', '102', 'Tue, Thu @ 10:00 AM - 11:30 AM'),
  ('123-00003', 'CS202 - Web Application Development', '202', 'Fri @ 8:00 AM - 10:00 AM'),
  ('123-00004', 'CS201 - Data Structures and Algorithms', '201', 'Mon, Wed @ 10:00 AM - 11:30 AM'),
  ('123-00004', 'IT201 - Database Management Systems', '302', 'Tue, Thu @ 1:00 PM - 2:30 PM'),
  ('123-00005', 'CS201 - Data Structures and Algorithms', '102', 'Tue, Thu @ 8:00 AM - 9:30 AM'),
  ('123-00005', 'IS101 - Systems Analysis and Design', '304', 'Fri @ 1:00 PM - 3:00 PM'),
  ('123-00006', 'IT201 - Database Management Systems', '302', 'Mon, Wed @ 1:00 PM - 2:30 PM'),
  ('123-00006', 'CS202 - Web Application Development', '202', 'Fri @ 8:00 AM - 10:00 AM'),
  ('123-00007', 'IS101 - Systems Analysis and Design', '102', 'Tue, Thu @ 10:00 AM - 11:30 AM'),
  ('123-00007', 'IT201 - Database Management Systems', '302', 'Tue, Thu @ 1:00 PM - 2:30 PM'),
  ('123-00008', 'CS201 - Data Structures and Algorithms', '201', 'Mon, Wed @ 10:00 AM - 11:30 AM'),
  ('123-00008', 'CS202 - Web Application Development', '304', 'Fri @ 10:00 AM - 12:00 PM'),
  ('221-02240', 'IT201 - Database Management Systems', '302', 'Mon, Wed @ 1:00 PM - 2:30 PM'),
  ('221-02240', 'IS101 - Systems Analysis and Design', '304', 'Fri @ 1:00 PM - 3:00 PM'),
  ('123-00010', 'CS201 - Data Structures and Algorithms', '102', 'Tue, Thu @ 8:00 AM - 9:30 AM'),
  ('123-00010', 'CS202 - Web Application Development', '202', 'Fri @ 8:00 AM - 10:00 AM'),
  ('123-00011', 'IS101 - Systems Analysis and Design', '102', 'Tue, Thu @ 10:00 AM - 11:30 AM'),
  ('123-00011', 'IT201 - Database Management Systems', '201', 'Mon, Wed @ 10:00 AM - 11:30 AM')
ON CONFLICT DO NOTHING;