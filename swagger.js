// swagger.js
// This file describes the whole API in a standard format called OpenAPI (also
// known as Swagger). server.js feeds this description to Swagger UI, which turns
// it into a documentation web page you can open in the browser at:
//
//     http://localhost:3000/api-docs
//
// On that page every endpoint has a "Try it out" button, so you can send real
// requests without writing any frontend code yet. It is the easiest way to see
// exactly what each endpoint expects and what it returns.
//
// Nothing here changes how the API behaves — it is only documentation.

const swaggerSpec = {
  openapi: '3.0.3',

  info: {
    title: 'Blog API',
    version: '1.0.0',
    description: `A simple blog REST API built with Node.js, Express and SQLite.

**What you can do with it**
- Get a list of blog posts (for a blog list page)
- Get one blog post with its full text and its comments (for a blog detail page)
- Add a comment to a blog post (name + comment)
- Create, edit and delete blog posts

**No login is needed.** Every endpoint is open, so you can focus on learning how a
frontend talks to a backend.

**Tip:** click **Try it out** on any endpoint below, fill in the fields and press
**Execute** to send a real request to your running server.`,
  },

  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],

  // Tags group the endpoints into sections on the documentation page.
  tags: [
    {
      name: 'Blogs',
      description: 'Create, read, update and delete blog posts',
    },
    {
      name: 'Comments',
      description: 'Read, add and delete comments on a blog post',
    },
    {
      name: 'System',
      description: 'Check that the server is running',
    },
  ],

  paths: {
    // -----------------------------------------------------------------------
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'Check the server is running',
        description:
          'Returns `{ "status": "ok" }`. Useful as a very first test that your server started correctly.',
        responses: {
          200: {
            description: 'The server is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', example: 'ok' } },
                },
              },
            },
          },
        },
      },
    },

    // -----------------------------------------------------------------------
    '/api/blogs': {
      get: {
        tags: ['Blogs'],
        summary: 'Get all blogs (for the blog list page)',
        description: `Returns every blog post, **newest first**.

To keep the list page fast this does **not** include the full blog text. Instead you
get a short \`excerpt\` (the first 150 characters) and a \`commentCount\`.

When the user clicks a blog, call \`GET /api/blogs/{id}\` to get the full text.`,
        responses: {
          200: {
            description: 'A list of blogs (an empty array if there are none yet)',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/BlogListItem' },
                },
              },
            },
          },
        },
      },

      post: {
        tags: ['Blogs'],
        summary: 'Create a new blog',
        description:
          'All three fields are required. Blank values (or values that are only spaces) are rejected.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BlogInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Blog created. The response includes the new `id` and `created_at`.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Blog' },
              },
            },
          },
          400: {
            description: 'A required field is missing or empty',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Title, author and content are required' },
              },
            },
          },
        },
      },
    },

    // -----------------------------------------------------------------------
    '/api/blogs/{id}': {
      parameters: [{ $ref: '#/components/parameters/BlogId' }],

      get: {
        tags: ['Blogs'],
        summary: 'Get one blog with its comments (for the blog detail page)',
        description: `Returns everything the detail page needs in **one single request**:
the title, author, the full \`content\`, and a \`comments\` array.

You do not need a second request to load the comments.`,
        responses: {
          200: {
            description: 'The blog, including its comments',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BlogWithComments' },
              },
            },
          },
          400: {
            description: 'The id in the URL is not a number',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Blog id must be a number' },
              },
            },
          },
          404: {
            description: 'There is no blog with that id',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Blog not found' },
              },
            },
          },
        },
      },

      put: {
        tags: ['Blogs'],
        summary: 'Update a blog',
        description:
          'Send **all three fields**, not only the one you changed — this replaces the whole blog.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BlogInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'The updated blog',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Blog' },
              },
            },
          },
          400: {
            description: 'A required field is missing, or the id is not a number',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Title, author and content are required' },
              },
            },
          },
          404: {
            description: 'There is no blog with that id',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Blog not found' },
              },
            },
          },
        },
      },

      delete: {
        tags: ['Blogs'],
        summary: 'Delete a blog',
        description:
          'Deletes the blog **and all of its comments** automatically (the database does this for you).',
        responses: {
          200: {
            description: 'Blog deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Message' },
                example: { message: 'Blog deleted' },
              },
            },
          },
          400: {
            description: 'The id in the URL is not a number',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Blog id must be a number' },
              },
            },
          },
          404: {
            description: 'There is no blog with that id',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Blog not found' },
              },
            },
          },
        },
      },
    },

    // -----------------------------------------------------------------------
    '/api/blogs/{id}/comments': {
      parameters: [{ $ref: '#/components/parameters/BlogId' }],

      get: {
        tags: ['Comments'],
        summary: 'Get the comments of one blog',
        description: `Returns only the comments, oldest first.

\`GET /api/blogs/{id}\` already includes the comments, so you usually do not need this.
It is handy when you want to refresh **just** the comment list after someone adds a comment.`,
        responses: {
          200: {
            description: 'The comments of that blog (an empty array if there are none)',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Comment' },
                },
              },
            },
          },
          400: {
            description: 'The id in the URL is not a number',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Blog id must be a number' },
              },
            },
          },
          404: {
            description: 'There is no blog with that id',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Blog not found' },
              },
            },
          },
        },
      },

      post: {
        tags: ['Comments'],
        summary: 'Add a comment to a blog',
        description:
          'This is what your comment form calls. Both `name` and `comment` are required.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommentInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Comment added. The response is the new comment, including its `id`.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Comment' },
              },
            },
          },
          400: {
            description: 'Name or comment is missing or empty',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Name and comment are required' },
              },
            },
          },
          404: {
            description: 'There is no blog with that id',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Blog not found' },
              },
            },
          },
        },
      },
    },

    // -----------------------------------------------------------------------
    '/api/comments/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'The id of the **comment** (not the blog)',
          schema: { type: 'integer', minimum: 1 },
          example: 1,
        },
      ],

      delete: {
        tags: ['Comments'],
        summary: 'Delete one comment',
        responses: {
          200: {
            description: 'Comment deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Message' },
                example: { message: 'Comment deleted' },
              },
            },
          },
          400: {
            description: 'The id in the URL is not a number',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Comment id must be a number' },
              },
            },
          },
          404: {
            description: 'There is no comment with that id',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Comment not found' },
              },
            },
          },
        },
      },
    },
  },

  // -------------------------------------------------------------------------
  // Reusable pieces, so we do not repeat ourselves above.
  // "$ref" points at these definitions.
  // -------------------------------------------------------------------------
  components: {
    parameters: {
      BlogId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'The id of the blog',
        schema: { type: 'integer', minimum: 1 },
        example: 1,
      },
    },

    schemas: {
      // What one item in GET /api/blogs looks like
      BlogListItem: {
        type: 'object',
        description: 'A blog as it appears in the list page — short excerpt, no full content.',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Getting Started with JavaScript' },
          author: { type: 'string', example: 'Sarah Ahmed' },
          excerpt: {
            type: 'string',
            description: 'The first 150 characters of the content, followed by "..."',
            example: 'JavaScript is the language that makes websites interactive...',
          },
          commentCount: {
            type: 'integer',
            description: 'How many comments this blog has',
            example: 3,
          },
          created_at: {
            type: 'string',
            description: 'When the blog was created (UTC)',
            example: '2026-07-24 09:00:00',
          },
        },
      },

      // A full blog, without comments
      Blog: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Getting Started with JavaScript' },
          author: { type: 'string', example: 'Sarah Ahmed' },
          content: {
            type: 'string',
            description: 'The full text of the blog',
            example: 'JavaScript is the language that makes websites interactive. HTML gives a page its structure...',
          },
          created_at: { type: 'string', example: '2026-07-24 09:00:00' },
        },
      },

      // A full blog together with its comments (the detail page)
      BlogWithComments: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Getting Started with JavaScript' },
          author: { type: 'string', example: 'Sarah Ahmed' },
          content: {
            type: 'string',
            example: 'JavaScript is the language that makes websites interactive. HTML gives a page its structure...',
          },
          created_at: { type: 'string', example: '2026-07-24 09:00:00' },
          comments: {
            type: 'array',
            items: { $ref: '#/components/schemas/Comment' },
          },
        },
      },

      Comment: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: {
            type: 'string',
            description: 'The name of the person who commented',
            example: 'Bilal',
          },
          comment: {
            type: 'string',
            description: 'The comment text',
            example: 'This helped me a lot as a beginner. Thanks!',
          },
          created_at: { type: 'string', example: '2026-07-24 09:00:00' },
        },
      },

      // What you SEND when creating or updating a blog
      BlogInput: {
        type: 'object',
        required: ['title', 'author', 'content'],
        properties: {
          title: {
            type: 'string',
            description: 'The blog title. Cannot be empty.',
            example: 'My first blog post',
          },
          author: {
            type: 'string',
            description: 'Who wrote it. Cannot be empty.',
            example: 'Ahmed',
          },
          content: {
            type: 'string',
            description: 'The full text of the blog. Cannot be empty.',
            example: 'This is the full text of my very first blog post.',
          },
        },
      },

      // What you SEND when adding a comment
      CommentInput: {
        type: 'object',
        required: ['name', 'comment'],
        properties: {
          name: {
            type: 'string',
            description: 'The name of the person commenting. Cannot be empty.',
            example: 'Ali',
          },
          comment: {
            type: 'string',
            description: 'The comment text. Cannot be empty.',
            example: 'Great post, very helpful!',
          },
        },
      },

      // Every error from this API has this shape
      Error: {
        type: 'object',
        description:
          'Every error looks like this, so you can always show `error` to the user.',
        properties: {
          error: {
            type: 'string',
            example: 'Blog not found',
          },
        },
      },

      // Successful delete responses
      Message: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Blog deleted' },
        },
      },
    },
  },
};

export default swaggerSpec;
