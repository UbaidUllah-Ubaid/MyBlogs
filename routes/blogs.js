// routes/blogs.js
// All the API endpoints live here.
//
// Every handler follows the same 4 steps, so once you understand one
// you understand all of them:
//   1. read the data (from req.params / req.body)
//   2. check the data is valid  -> if not, send 400
//   3. talk to the database with a prepared statement
//   4. send JSON back
//
// About "prepared statements":
//   db.prepare('SELECT * FROM blogs WHERE id = ?').get(id)
// The "?" is a placeholder. Never build SQL by joining strings with user input,
// otherwise someone can break your database (this is called SQL injection).

import express from 'express';
import db from '../db.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

// Turns "  hello  " into "hello", and anything that is not text into "".
function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// If the request was sent with no body at all, req.body is undefined.
// This gives us a plain empty object instead, so reading body.title does not crash.
function body(req) {
  return req.body || {};
}

// Makes a short preview of the blog content for the list page.
function makeExcerpt(content, length = 150) {
  if (content.length <= length) return content;
  return content.slice(0, length).trimEnd() + '...';
}

// Finds a blog by id. Returns the blog row, or undefined if there is no such blog.
function findBlog(id) {
  return db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);
}

// Checks that an id in the URL is actually a number (e.g. /api/blogs/abc is not).
function isValidId(id) {
  return /^\d+$/.test(id);
}

// ---------------------------------------------------------------------------
// GET /api/blogs
// List every blog, newest first.
// Used by the BLOG LIST PAGE. It does not send the full content on purpose —
// only a short excerpt, so the list stays small and fast.
// ---------------------------------------------------------------------------
router.get('/blogs', (req, res) => {
  const blogs = db
    .prepare(
      `SELECT b.id,
              b.title,
              b.author,
              b.content,
              b.created_at,
              (SELECT COUNT(*) FROM comments c WHERE c.blog_id = b.id) AS commentCount
       FROM blogs b
       ORDER BY b.id DESC`
    )
    .all();

  // Replace the full content with a short excerpt.
  const list = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    author: blog.author,
    excerpt: makeExcerpt(blog.content),
    commentCount: blog.commentCount,
    created_at: blog.created_at,
  }));

  res.json(list);
});

// ---------------------------------------------------------------------------
// GET /api/blogs/:id
// One blog with its full content AND all of its comments.
// Used by the BLOG DETAIL PAGE — one request gives you everything you need.
// ---------------------------------------------------------------------------
router.get('/blogs/:id', (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Blog id must be a number' });
  }

  const blog = findBlog(id);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  const comments = db
    .prepare('SELECT id, name, comment, created_at FROM comments WHERE blog_id = ? ORDER BY id ASC')
    .all(id);

  res.json({
    id: blog.id,
    title: blog.title,
    author: blog.author,
    content: blog.content,
    created_at: blog.created_at,
    comments,
  });
});

// ---------------------------------------------------------------------------
// POST /api/blogs
// Create a new blog.
// Body: { "title": "...", "author": "...", "content": "..." }
// ---------------------------------------------------------------------------
router.post('/blogs', (req, res) => {
  const title = clean(body(req).title);
  const author = clean(body(req).author);
  const content = clean(body(req).content);

  if (!title || !author || !content) {
    return res.status(400).json({ error: 'Title, author and content are required' });
  }

  const result = db
    .prepare('INSERT INTO blogs (title, author, content) VALUES (?, ?, ?)')
    .run(title, author, content);

  // Read the row back so the frontend gets the id and created_at too.
  const newBlog = findBlog(Number(result.lastInsertRowid));

  // 201 means "created".
  res.status(201).json(newBlog);
});

// ---------------------------------------------------------------------------
// PUT /api/blogs/:id
// Update an existing blog. Send all three fields.
// ---------------------------------------------------------------------------
router.put('/blogs/:id', (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Blog id must be a number' });
  }

  if (!findBlog(id)) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  const title = clean(body(req).title);
  const author = clean(body(req).author);
  const content = clean(body(req).content);

  if (!title || !author || !content) {
    return res.status(400).json({ error: 'Title, author and content are required' });
  }

  db.prepare('UPDATE blogs SET title = ?, author = ?, content = ? WHERE id = ?').run(
    title,
    author,
    content,
    id
  );

  res.json(findBlog(id));
});

// ---------------------------------------------------------------------------
// DELETE /api/blogs/:id
// Delete a blog. Its comments are deleted automatically (ON DELETE CASCADE).
// ---------------------------------------------------------------------------
router.delete('/blogs/:id', (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Blog id must be a number' });
  }

  if (!findBlog(id)) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  db.prepare('DELETE FROM blogs WHERE id = ?').run(id);

  res.json({ message: 'Blog deleted' });
});

// ---------------------------------------------------------------------------
// GET /api/blogs/:id/comments
// Only the comments of one blog.
// (The detail endpoint above already includes them, but this is handy if you
//  want to refresh just the comment list after adding a new comment.)
// ---------------------------------------------------------------------------
router.get('/blogs/:id/comments', (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Blog id must be a number' });
  }

  if (!findBlog(id)) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  const comments = db
    .prepare('SELECT id, name, comment, created_at FROM comments WHERE blog_id = ? ORDER BY id ASC')
    .all(id);

  res.json(comments);
});

// ---------------------------------------------------------------------------
// POST /api/blogs/:id/comments
// Add a comment to a blog.
// Body: { "name": "Ali", "comment": "Nice post!" }
// ---------------------------------------------------------------------------
router.post('/blogs/:id/comments', (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Blog id must be a number' });
  }

  if (!findBlog(id)) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  const name = clean(body(req).name);
  const comment = clean(body(req).comment);

  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and comment are required' });
  }

  const result = db
    .prepare('INSERT INTO comments (blog_id, name, comment) VALUES (?, ?, ?)')
    .run(id, name, comment);

  const newComment = db
    .prepare('SELECT id, name, comment, created_at FROM comments WHERE id = ?')
    .get(Number(result.lastInsertRowid));

  res.status(201).json(newComment);
});

// ---------------------------------------------------------------------------
// DELETE /api/comments/:id
// Delete one comment.
// ---------------------------------------------------------------------------
router.delete('/comments/:id', (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Comment id must be a number' });
  }

  const existing = db.prepare('SELECT id FROM comments WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  db.prepare('DELETE FROM comments WHERE id = ?').run(id);

  res.json({ message: 'Comment deleted' });
});

export default router;
