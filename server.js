// server.js
// This is the entry point of the backend. Run it with:  npm start

import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import blogRoutes from './routes/blogs.js';
import swaggerSpec from './swagger.js';

const app = express();
const PORT = process.env.PORT || 3000;
const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const frontendFiles = new Set([
  '404.html',
  'index.html',
  'index2.html',
  'script.js',
  'script2.js',
  'style.css',
  'style2.css',
]);

// CORS lets your frontend (running on a different port, for example
// Live Server on http://127.0.0.1:5500) call this API from the browser.
// Without this line the browser blocks the request.
app.use(cors());

// Lets the server read JSON that the frontend sends in the request body,
// so `req.body` is a normal JavaScript object.
app.use(express.json());

// A tiny logger, so you can SEE your frontend's requests arriving in the terminal.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Swagger UI — interactive API documentation at http://localhost:3000/api-docs
// Open it in the browser to see every endpoint and test it with "Try it out".
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Blog API Docs',
    swaggerOptions: {
      // Keep the endpoint list collapsed at first so the page is easy to scan.
      docExpansion: 'list',
      // Show how long each test request took.
      displayRequestDuration: true,
    },
  })
);

// The raw OpenAPI description as JSON, in case you want to import the API into
// another tool such as Postman.
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

// Quick check that the server is alive: http://localhost:3000/api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// All the blog and comment endpoints, mounted under /api
app.use('/api', blogRoutes);

// Serve only the frontend files, not source code or the database file.
app.get('/', (req, res) => {
  res.sendFile(path.join(projectRoot, 'index.html'));
});

app.get('/:filename', (req, res, next) => {
  if (!frontendFiles.has(req.params.filename)) {
    return next();
  }

  res.sendFile(path.join(projectRoot, req.params.filename));
});

// If no route above matched, the URL is wrong.
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// If anything throws an unexpected error, we still answer with JSON
// instead of an HTML error page.
app.use((err, req, res, next) => {
  console.error(err);

  // This happens when the frontend sends broken JSON in the request body.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }

  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API docs:  http://localhost:${PORT}/api-docs`);
  console.log(`Try it:    http://localhost:${PORT}/api/blogs`);
});
