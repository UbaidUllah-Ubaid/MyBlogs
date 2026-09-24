const API_BASE_URL = "/api";

const firstPart = window.location.search;
const secondPart = new URLSearchParams(firstPart);
const blogId = secondPart.get("blogId");
console.log("id: ",blogId)

// data ko fetch kia 
async function getBlog() {

    try {
        const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch blog");
        }
        const data = await response.json();
        renderBlog(data);
        console.log(data)
    } 
    catch (error) {
        console.log(error.message);
    }
}

// blog ko print kia data se
function renderBlog(blog) {

    const blogBox = document.getElementById("blog-box");

    blogBox.innerHTML = `
        <h1>${blog.title}</h1>
        <p><b>By Author:</b> ${blog.author}</p>
        <p class="blog-content">${blog.content}</p>
        <p><b>Date:</b> ${blog.created_at}</p>
    `;

    // blog ko update krny k liye blog ki value usmy put kii
    const updateTitle = document.getElementById("update-title");
    const updateAuthor = document.getElementById("update-author");
    const updateContent = document.getElementById("update-content");

    updateTitle.value = blog.title;
    updateAuthor.value = blog.author;
    updateContent.value = blog.content;

    renderComments(blog.comments);
}

// comments ko print kia jo blog object me thy
function renderComments(comments) {

    const commentsBox = document.getElementById("comments-box");

    commentsBox.innerHTML = "";

    // comments Object thaa iss liye usko loop lagaya 
    comments.forEach((comment) => {
        const div = document.createElement("div");

        div.classList = "comment-card";

        div.innerHTML = `
            <h3>${comment.name}</h3>
            <p>${comment.comment}</p>
            <p>${comment.created_at}</p>
            <button class="delete-comment-btn">Delete Comment</button>
        `;
        commentsBox.appendChild(div);

        const deleteCommentBtn = div.querySelector(".delete-comment-btn");

        // comments ko uski id se delete kia 
        deleteCommentBtn.addEventListener("click", async function () {

                const response = await fetch(`${API_BASE_URL}/comments/${comment.id}`,
                    {
                        method: "DELETE",

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Comment delete failed");
                }
                div.remove();
            }
        );
    });
}

const addCommentBtn = document.getElementById("add-comment-btn");

// comments ko add krny k liye form ki value ko server me save kia 
addCommentBtn.addEventListener("click", async function () {

        const nameInput = document.getElementById("comment-name");
        const commentInput = document.getElementById("comment-text");

        const commentData = {
            name: nameInput.value,
            comment: commentInput.value
        };

        const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`,

            {
                method: "POST",

                headers: {

                    "Content-Type": "application/json"
                },

                body: JSON.stringify(commentData)
            }
        );

        if (!response.ok) {
            throw new Error("Comment not added");
        }

        nameInput.value = "";
        commentInput.value = "";

        // or response jo aya server se usko wapis print krdiya 
        getBlog();
    }
);

const updateBlogBtn = document.getElementById("update-blog-btn");

// asy hi blog ki value lee server ko dee or response aya usko print krdiya 
updateBlogBtn.addEventListener("click", async function () {

        const updateTitle = document.getElementById("update-title");
        const updateAuthor = document.getElementById("update-author");
        const updateContent = document.getElementById("update-content");

        const updatedBlog = {
            title: updateTitle.value,
            author: updateAuthor.value,
            content: updateContent.value
        };

        const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`,

            {
                method: "PUT",

                headers: {
                  "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedBlog)
            }
        );

        if (!response.ok) {
            throw new Error("Blog update failed");
        }

        getBlog();
    }
);

const deleteBlogBtn = document.getElementById("delete-blog-btn");

// blog ko delete krny k liye 
deleteBlogBtn.addEventListener("click",async function () {

        const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`,

            {
                method: "DELETE",

                headers: {
                    Accept: "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Blog delete failed");
        }
    }
);

getBlog();