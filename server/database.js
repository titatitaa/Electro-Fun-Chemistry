import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

export function createDatabase(databasePath = process.env.DATABASE_PATH || './data/chemistry-lab.sqlite') {
  if (databasePath !== ':memory:') {
    mkdirSync(path.dirname(path.resolve(databasePath)), { recursive: true })
  }
  const db = new Database(databasePath)
  db.pragma('foreign_keys = ON')
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      username TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
      class_name TEXT NOT NULL,
      school TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      used_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (teacher_id, name)
    );

    CREATE TABLE IF NOT EXISTS class_members (
      class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      added_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (class_id, student_id)
    );
    CREATE INDEX IF NOT EXISTS class_members_student ON class_members(student_id);

    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      module_id TEXT NOT NULL,
      module_title TEXT NOT NULL,
      score INTEGER NOT NULL CHECK (score >= 0),
      total INTEGER NOT NULL CHECK (total > 0 AND score <= total),
      completed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS quiz_results_student ON quiz_results(student_id, completed_at);
  `)
  return db
}

export function publicUser(user) {
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    username: user.username,
    className: user.class_name,
    school: user.school,
    role: user.role,
  }
}
