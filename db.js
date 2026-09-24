// db.js
// This file sets up the database.
// We use SQLite, which stores everything in one single file called "blog.db".
// SQLite is built into Node.js (node:sqlite), so there is nothing extra to install
// and no database server to start.

import { DatabaseSync } from 'node:sqlite';

// Open (or automatically create) the database file next to this project.
const db = new DatabaseSync('blog.db');

// Turn on foreign keys so that deleting a blog also deletes its comments.
// SQLite has this switched OFF by default, so we must enable it every time.
db.exec('PRAGMA foreign_keys = ON');

// Create the tables the first time the app runs.
// "IF NOT EXISTS" means it is safe to run this again and again.
db.exec(`
  CREATE TABLE IF NOT EXISTS blogs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    author     TEXT NOT NULL,
    content    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    blog_id    INTEGER NOT NULL,
    name       TEXT NOT NULL,
    comment    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (blog_id) REFERENCES blogs (id) ON DELETE CASCADE
  )
`);

export default db;
