const API_BASE_URL = "/api";

// const blogButton = document.getElementById("read-more")

async function getBlogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    const data = await response.json();
    renderBlogs(data);
    console.log(data)

    if (!response.ok) {
      throw new Error("Blog not created");
    }
  } 
  catch (error) {
    console.log(error.message);
  }
}

function renderBlogs(data) {
  const blogBox = document.getElementById("blogs-box");
  // const blogButton = document.getElementById("read-more")

  blogBox.innerHTML = "";

  data.forEach((blog) => {

    const li = document.createElement("li");
    li.classList.add("blog-card");

    // const blogButton = getElementById("read-more");

    
    li.innerHTML = `
            <h2>${blog.title}</h2>
            <p class="author">By: ${blog.author}</p>
            <p class="blog-preview">${blog.excerpt}</p>
            <button class="read-more">Read More</button>`;

            const blogButton = li.querySelector(".read-more");
            blogButton.addEventListener("click", function () {
                            window.location.href = `index2.html?blogId=${blog.id}`
                        });
              blogBox.appendChild(li);
  });
}

const form = document.getElementById("blogForm");

form.addEventListener("submit", createBlog);

async function createBlog(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const content = document.getElementById("content").value;

  const blogData = {
    title,
    author,
    content,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      throw new Error("Blog not created");
    }

    form.reset();
    getBlogs();
  } 
  catch (error) {
    console.log(error.message);
  }
}

getBlogs();
