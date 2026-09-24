// seed.js
// Puts some example data in the database so there is something to show
// while you build the frontend.  Run it with:  npm run seed
//
// It clears the tables first, so you can run it as many times as you like.

import db from './db.js';

const blogs = [
  {
    title: 'Getting Started with JavaScript',
    author: 'Sarah Ahmed',
    content: `JavaScript is the language that makes websites interactive. HTML gives a page its structure, CSS makes it look good, and JavaScript makes it do things: react to clicks, load data, and update the page without reloading it.

The best way to learn is to build something small and finish it. A blog page is a great first project, because it uses almost everything you need in real work: fetching data from a server, looping over a list to build HTML, reading values from a form, and sending them back.

Start with variables, functions and arrays. Then learn the array methods map, filter and forEach, because you will use them constantly when turning data into HTML. After that, learn fetch() and async/await so you can talk to a backend like this one.

Do not try to memorise everything. Look things up, read the error messages carefully, and use console.log() to check what your variables actually contain. Every developer does this every single day.`,
    comments: [
      { name: 'Bilal', comment: 'This helped me a lot as a beginner. Thanks!' },
      { name: 'Ayesha', comment: 'The tip about console.log is so true.' },
      { name: 'Usman', comment: 'Please write a part 2 about async/await.' },
    ],
  },
  {
    title: 'How to Connect a Frontend to a REST API',
    author: 'Imran Khan',
    content: `A REST API is just a set of URLs that return data instead of a web page. Your frontend asks for data, the backend answers with JSON, and your JavaScript turns that JSON into HTML.

In the browser you use fetch(). You give it a URL, wait for the response, and then convert the response to a JavaScript object with response.json(). Because this takes time, fetch is asynchronous, which is why you use await inside an async function.

There are three things beginners usually get stuck on. First, CORS: if the backend does not allow your origin, the browser blocks the request. Second, forgetting the Content-Type header when sending JSON, so the server cannot read the body. Third, forgetting that fetch does not throw an error for a 404 or 500 response, so you have to check response.ok yourself.

Once you understand those three things, connecting any frontend to any backend becomes the same routine every time.`,
    comments: [
      { name: 'Fatima', comment: 'The CORS part finally makes sense now.' },
      { name: 'Hassan', comment: 'I always forget the Content-Type header. Good reminder.' },
    ],
  },
];

// Empty the tables so we start fresh.
db.exec('DELETE FROM comments');
db.exec('DELETE FROM blogs');

// Reset the auto-increment counters so ids start at 1 again.
// (This table only exists once something has been inserted before, so we guard it.)
db.exec("DELETE FROM sqlite_sequence WHERE name IN ('blogs', 'comments')");

const insertBlog = db.prepare('INSERT INTO blogs (title, author, content) VALUES (?, ?, ?)');
const insertComment = db.prepare('INSERT INTO comments (blog_id, name, comment) VALUES (?, ?, ?)');

let commentCount = 0;

for (const blog of blogs) {
  const result = insertBlog.run(blog.title, blog.author, blog.content);
  const blogId = Number(result.lastInsertRowid);

  for (const c of blog.comments) {
    insertComment.run(blogId, c.name, c.comment);
    commentCount++;
  }
}
