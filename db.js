// db.js
// This file sets up the database.
// We use SQLite, which stores everything in one single file called "blog.db".
// SQLite is built into Node.js (node:sqlite), so there is nothing extra to install
// and no database server to start.

import { DatabaseSync } from 'node:sqlite';
import initialData from './initial-data.js';

// Use the hosting provider's persistent disk when configured; keep local development unchanged.
const db = new DatabaseSync(process.env.DATABASE_PATH || 'blog.db');

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

db.exec(`
  CREATE TABLE IF NOT EXISTS app_metadata (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

const initialDataLoaded = db
  .prepare('SELECT value FROM app_metadata WHERE key = ?')
  .get('initial_data_loaded');

if (!initialDataLoaded) {
  const blogCount = db.prepare('SELECT COUNT(*) AS count FROM blogs').get().count;

  if (blogCount === 0) {
    const insertBlog = db.prepare(
      'INSERT INTO blogs (id, title, author, content, created_at) VALUES (?, ?, ?, ?, ?)'
    );
    const insertComment = db.prepare(
      'INSERT INTO comments (id, blog_id, name, comment, created_at) VALUES (?, ?, ?, ?, ?)'
    );

    for (const blog of initialData.blogs) {
      insertBlog.run(blog.id, blog.title, blog.author, blog.content, blog.created_at);
    }

    for (const comment of initialData.comments) {
      insertComment.run(
        comment.id,
        comment.blog_id,
        comment.name,
        comment.comment,
        comment.created_at
      );
    }
  }

  db.prepare('INSERT INTO app_metadata (key, value) VALUES (?, ?)').run(
    'initial_data_loaded',
    'true'
  );
}

export default db;
