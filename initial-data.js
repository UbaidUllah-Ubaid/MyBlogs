const initialData = {
  blogs: [
    {
      id: 1,
      title: 'Getting Started with JavaScript',
      author: 'Sarah Ahmed',
      content: `JavaScript is the language that makes websites interactive. HTML gives a page its structure, CSS makes it look good, and JavaScript makes it do things: react to clicks, load data, and update the page without reloading it.

The best way to learn is to build something small and finish it. A blog page is a great first project, because it uses almost everything you need in real work: fetching data from a server, looping over a list to build HTML, reading values from a form, and sending them back.

Start with variables, functions and arrays. Then learn the array methods map, filter and forEach, because you will use them constantly when turning data into HTML. After that, learn fetch() and async/await so you can talk to a backend like this one.

Do not try to memorise everything. Look things up, read the error messages carefully, and use console.log() to check what your variables actually contain. Every developer does this every single day.`,
      created_at: '2026-07-29 19:49:21',
    },
    {
      id: 2,
      title: 'How to Connect a Frontend to a REST API',
      author: 'Imran Khan',
      content: `A REST API is just a set of URLs that return data instead of a web page. Your frontend asks for data, the backend answers with JSON, and your JavaScript turns that JSON into HTML.

In the browser you use fetch(). You give it a URL, wait for the response, and then convert the response to a JavaScript object with response.json(). Because this takes time, fetch is asynchronous, which is why you use await inside an async function.

There are three things beginners usually get stuck on. First, CORS: if the backend does not allow your origin, the browser blocks the request. Second, forgetting the Content-Type header when sending JSON, so the server cannot read the body. Third, forgetting that fetch does not throw an error for a 404 or 500 response, so you have to check response.ok yourself.

Once you understand those three things, connecting any frontend to any backend becomes the same routine every time.`,
      created_at: '2026-07-29 19:49:21',
    },
    {
      id: 5,
      title: 'The importance of learning programming',
      author: 'UbaidUllah',
      content:
        'Programming is an essential skill today. Using languages like JavaScript, we can create interactive and dynamic websites. Learning to program enables us to build websites, applications, and a wide variety of software.',
      created_at: '2026-07-30 19:00:37',
    },
    {
      id: 6,
      title: 'Test Blog',
      author: 'Moeez',
      content: 'Hello World!!!',
      created_at: '2026-07-30 20:23:24',
    },
    {
      id: 7,
      title: 'Test Blog 2',
      author: 'Moeez',
      content: 'HELLO WORLD 2!!',
      created_at: '2026-07-30 20:33:57',
    },
  ],
  comments: [
    {
      id: 1,
      blog_id: 1,
      name: 'Bilal',
      comment: 'This helped me a lot as a beginner. Thanks!',
      created_at: '2026-07-29 19:49:21',
    },
    {
      id: 2,
      blog_id: 1,
      name: 'Ayesha',
      comment: 'The tip about console.log is so true.',
      created_at: '2026-07-29 19:49:21',
    },
    {
      id: 3,
      blog_id: 1,
      name: 'Usman',
      comment: 'Please write a part 2 about async/await.',
      created_at: '2026-07-29 19:49:21',
    },
    {
      id: 4,
      blog_id: 2,
      name: 'Fatima',
      comment: 'The CORS part finally makes sense now.',
      created_at: '2026-07-29 19:49:21',
    },
    {
      id: 5,
      blog_id: 2,
      name: 'Hassan',
      comment: 'I always forget the Content-Type header. Good reminder.',
      created_at: '2026-07-29 19:49:21',
    },
    {
      id: 6,
      blog_id: 2,
      name: 'test55',
      comment: 'hello',
      created_at: '2026-07-29 20:37:37',
    },
    {
      id: 7,
      blog_id: 5,
      name: 'UbaidUllah',
      comment: 'test comment "nice"',
      created_at: '2026-07-30 19:01:47',
    },
    {
      id: 8,
      blog_id: 6,
      name: 'Moeez',
      comment: 'TEST COMMENT',
      created_at: '2026-07-30 20:23:55',
    },
  ],
};

export default initialData;