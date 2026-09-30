# Blog Backend API

A small REST API for a blog website, built with **Node.js + Express + SQLite**.

It gives you everything a blog frontend needs:

- a list of blog posts (for the blog list page)
- one blog post with its full content and its comments (for the blog detail page)
- adding a comment (name + comment)
- creating, editing and deleting blog posts

There is **no login and no password** — every endpoint is open. That is on purpose,
so you can focus on learning how a frontend talks to a backend.

---

## 1. Setup

You need **Node.js version 22 or newer**. Check with:

```bash
node -v
```

Then, inside this folder:

```bash
npm install     # installs express and cors
npm run seed    # puts 2 example blogs in the database
npm start       # starts the server
```

You should see:

```
Server running on http://localhost:3000
API docs:  http://localhost:3000/api-docs
Try it:    http://localhost:3000/api/blogs
```

Open <http://localhost:3000/api/blogs> in your browser — you should see JSON with 2 blogs.

### 📘 Interactive API documentation (Swagger)

Open **<http://localhost:3000/api-docs>** in your browser.

This is the easiest way to explore the API. Every endpoint is listed with the exact
fields it expects and the exact JSON it returns. Each one has a **Try it out** button:

1. Click an endpoint to open it
2. Click **Try it out**
3. Fill in the fields (an example is filled in for you)
4. Click **Execute** — it sends a **real** request to your running server

Use this to understand an endpoint *before* you write the frontend code for it.

> The raw OpenAPI file is at <http://localhost:3000/api-docs.json> if you ever want to
> import the API into another tool like Postman.

**Useful commands**

| Command | What it does |
|---|---|
| `npm start` | Starts the server |
| `npm run dev` | Starts the server and restarts it automatically when you edit a file |
| `npm run seed` | Resets the database back to the 2 example blogs |

> The database is a single file called `blog.db`, created automatically.
> If you ever want to start completely fresh, delete `blog.db` and run `npm run seed` again.

---

## 2. The files

| File | What it is for |
|---|---|
| `server.js` | Starts the server, turns on CORS and JSON reading, serves the Swagger docs |
| `db.js` | Opens the SQLite database and creates the tables |
| `routes/blogs.js` | **All the endpoints live here** — this is the file to read first |
| `swagger.js` | Describes the API for the `/api-docs` page (documentation only) |
| `seed.js` | Fills the database with example data |

> If you add a new endpoint in `routes/blogs.js`, also describe it in `swagger.js`,
> otherwise it will not appear on the docs page.

---

## 3. The database

**blogs**

| Column | Type | Description |
|---|---|---|
| `id` | number | Created automatically |
| `title` | text | Blog title |
| `author` | text | Who wrote it |
| `content` | text | The full blog text |
| `created_at` | text | Date and time, added automatically |

**comments**

| Column | Type | Description |
|---|---|---|
| `id` | number | Created automatically |
| `blog_id` | number | Which blog this comment belongs to |
| `name` | text | Name of the person commenting |
| `comment` | text | The comment text |
| `created_at` | text | Date and time, added automatically |

Deleting a blog automatically deletes its comments.

---

## 4. All endpoints

Base URL: `http://localhost:3000`

| Method | URL | What it does |
|---|---|---|
| GET | `/api/health` | Check the server is running |
| GET | `/api/blogs` | Get all blogs (for the list page) |
| GET | `/api/blogs/:id` | Get one blog **+ its comments** (for the detail page) |
| POST | `/api/blogs` | Create a blog |
| PUT | `/api/blogs/:id` | Update a blog |
| DELETE | `/api/blogs/:id` | Delete a blog |
| GET | `/api/blogs/:id/comments` | Get only the comments of one blog |
| POST | `/api/blogs/:id/comments` | Add a comment to a blog |
| DELETE | `/api/comments/:id` | Delete one comment |

---

### GET `/api/blogs`

Returns an array. Note it sends a short **`excerpt`**, not the full content — that
keeps the list page light. Newest blog comes first.

```json
[
  {
    "id": 2,
    "title": "How to Connect a Frontend to a REST API",
    "author": "Imran Khan",
    "excerpt": "A REST API is just a set of URLs that return data instead of a web page...",
    "commentCount": 2,
    "created_at": "2026-07-24 09:00:00"
  }
]
```

---

### GET `/api/blogs/:id`

Everything the detail page needs in **one request** — full content *and* comments.

```json
{
  "id": 1,
  "title": "Getting Started with JavaScript",
  "author": "Sarah Ahmed",
  "content": "JavaScript is the language that makes websites interactive...",
  "created_at": "2026-07-24 09:00:00",
  "comments": [
    { "id": 1, "name": "Bilal", "comment": "This helped me a lot!", "created_at": "2026-07-24 09:00:00" }
  ]
}
```

If the blog does not exist you get status **404** and `{ "error": "Blog not found" }`.

---

### POST `/api/blogs`

Send:

```json
{ "title": "My first blog", "author": "Ahmed", "content": "The full text of the blog." }
```

All three fields are required. You get back status **201** and the created blog
(including its new `id`).

---

### PUT `/api/blogs/:id`

Same body as POST. Send **all three fields**, not just the one you changed.
Returns the updated blog.

---

### DELETE `/api/blogs/:id`

Returns `{ "message": "Blog deleted" }`.

---

### POST `/api/blogs/:id/comments`

Send:

```json
{ "name": "Ali", "comment": "Great post!" }
```

Both fields are required. You get back status **201** and the new comment:

```json
{ "id": 6, "name": "Ali", "comment": "Great post!", "created_at": "2026-07-24 09:05:00" }
```

---

### DELETE `/api/comments/:id`

Returns `{ "message": "Comment deleted" }`.

---

## 5. Errors

Errors always come back as JSON with an `error` key, so you can show the message to the user:

```json
{ "error": "Title, author and content are required" }
```

| Status | Meaning | Example |
|---|---|---|
| 400 | You sent something wrong | Missing title, or an id that is not a number |
| 404 | Not found | That blog id does not exist, or the URL is wrong |
| 500 | The server crashed | Check the terminal where `npm start` is running |

---

## 6. Connecting your frontend

### Get the blog list

```js
async function loadBlogs() {
  const response = await fetch('http://localhost:3000/api/blogs');
  const blogs = await response.json();

  document.getElementById('blog-list').innerHTML = blogs
    .map(
      (blog) => `
        <div class="blog-card">
          <h2><a href="detail.html?id=${blog.id}">${blog.title}</a></h2>
          <p class="meta">By ${blog.author} · ${blog.commentCount} comments</p>
          <p>${blog.excerpt}</p>
        </div>`
    )
    .join('');
}

loadBlogs();
```

### Get one blog with its comments

The blog id comes from the URL, for example `detail.html?id=1`:

```js
const id = new URLSearchParams(window.location.search).get('id');

async function loadBlog() {
  const response = await fetch(`http://localhost:3000/api/blogs/${id}`);

  // fetch does NOT throw on 404 — you have to check this yourself.
  if (!response.ok) {
    document.body.innerHTML = '<p>Blog not found</p>';
    return;
  }

  const blog = await response.json();

  document.getElementById('title').textContent = blog.title;
  document.getElementById('author').textContent = blog.author;
  document.getElementById('content').textContent = blog.content;

  document.getElementById('comments').innerHTML = blog.comments
    .map((c) => `<div class="comment"><strong>${c.name}</strong><p>${c.comment}</p></div>`)
    .join('');
}

loadBlog();
```

### Add a comment from a form

```js
document.getElementById('comment-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // stop the page from reloading

  const response = await fetch(`http://localhost:3000/api/blogs/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // don't forget this line!
    body: JSON.stringify({
      name: document.getElementById('name').value,
      comment: document.getElementById('comment').value,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.error); // e.g. "Name and comment are required"
    return;
  }

  event.target.reset();
  loadBlog(); // reload so the new comment appears
});
```

### Three things that usually go wrong

1. **CORS error in the browser console** — make sure the server is running.
   CORS is already enabled here, so any frontend port works.
2. **The server says a field is required, but you sent it** — you probably forgot
   `headers: { 'Content-Type': 'application/json' }` or `JSON.stringify(...)`.
3. **Nothing happens on a 404** — `fetch` does not throw for 404 or 500.
   Always check `if (!response.ok)`.

---

## 7. Testing without a frontend

The easiest way is the Swagger page at <http://localhost:3000/api-docs> — click
**Try it out** on any endpoint, then **Execute**.

You can also test from the terminal with `curl`:

```bash
# list blogs
curl http://localhost:3000/api/blogs

# one blog with comments
curl http://localhost:3000/api/blogs/1

# create a blog
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{"title":"My blog","author":"Ahmed","content":"Hello world"}'

# add a comment
curl -X POST http://localhost:3000/api/blogs/1/comments \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali","comment":"Nice post!"}'

# delete a blog
curl -X DELETE http://localhost:3000/api/blogs/1
```

## 8. Deploying from GitHub

This repository includes a Render Blueprint in `render.yaml`. It deploys the
website and API together, so the frontend's `/api` requests continue to work on
the public URL. The SQLite database is stored on a persistent disk, and the
current five blogs and eight comments are loaded only when that database is new.

1. Push this repository to GitHub.
2. In Render, choose **New > Blueprint** and select this GitHub repository.
3. Review the Blueprint and create the service. The persistent disk requires a
  paid Render instance.
4. Open the URL Render gives you. Add `/api/blogs` to the same URL to check the
  backend response.

Do not run `npm run seed` on the deployed database: that command resets all
blogs and comments to the examples in `seed.js`.
