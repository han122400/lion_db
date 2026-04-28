const postForm = document.querySelector("#post-form");
const postIdInput = document.querySelector("#post-id");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const contentInput = document.querySelector("#content");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-button");
const postList = document.querySelector("#post-list");
const postCount = document.querySelector("#post-count");
const formTitle = document.querySelector("#form-title");

const API_URL = "http://localhost:3000/posts";

let posts = [];

async function createPost(title, author, content) {
  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, author, content })
  });
}

async function readPosts() {
  const response = await fetch(API_URL);
  return response.json();
}

async function updatePost(id, title, author, content) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, author, content })
  });
}

async function deletePost(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
}

async function renderPosts() {
  const currentPosts = await readPosts();
  posts = currentPosts;
  postCount.textContent = `${currentPosts.length}개`;

  if (currentPosts.length === 0) {
    postList.innerHTML = `
      <tr>
        <td class="empty" colspan="5">등록된 게시글이 없습니다.</td>
      </tr>
    `;
    return;
  }

  postList.innerHTML = currentPosts
    .map((post, index) => {
      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <div class="post-title">${post.title}</div>
            <small>${post.content}</small>
          </td>
          <td>${post.author}</td>
          <td>${post.created_at}</td>
          <td>
            <button class="small-button" onclick="startEdit(${post.id})">수정</button>
            <button class="small-button danger" onclick="removePost(${post.id})">삭제</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function startEdit(id) {
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return;
  }

  postIdInput.value = post.id;
  titleInput.value = post.title;
  authorInput.value = post.author;
  contentInput.value = post.content;
  formTitle.textContent = "게시글 수정";
  submitButton.textContent = "수정";
  cancelButton.hidden = false;
}

async function removePost(id) {
  const isConfirmed = confirm("게시글을 삭제할까요?");

  if (!isConfirmed) {
    return;
  }

  await deletePost(id);
  resetForm();
  renderPosts();
}

function resetForm() {
  postForm.reset();
  postIdInput.value = "";
  formTitle.textContent = "게시글 작성";
  submitButton.textContent = "등록";
  cancelButton.hidden = true;
}

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
}

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const content = contentInput.value.trim();
  const editingId = Number(postIdInput.value);

  if (!title || !author || !content) {
    alert("제목, 작성자, 내용을 모두 입력해주세요.");
    return;
  }

  if (editingId) {
    await updatePost(editingId, title, author, content);
  } else {
    await createPost(title, author, content);
  }

  resetForm();
  renderPosts();
});

cancelButton.addEventListener("click", resetForm);

renderPosts();
