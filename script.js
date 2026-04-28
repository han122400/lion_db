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

let posts = [
  {
    id: 1,
    title: "첫 번째 게시글입니다",
    author: "운영진",
    content: "CRUD 실습을 위한 예시 게시글입니다.",
    createdAt: "2026-04-28"
  }
];

let nextId = 2;

function createPost(title, author, content) {
  posts.push({
    id: nextId,
    title,
    author,
    content,
    createdAt: getToday()
  });

  nextId += 1;
}

function readPosts() {
  return posts;
}

function updatePost(id, title, author, content) {
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return;
  }

  post.title = title;
  post.author = author;
  post.content = content;
}

function deletePost(id) {
  posts = posts.filter((post) => post.id !== id);
}

function renderPosts() {
  const currentPosts = readPosts();
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
          <td>${post.createdAt}</td>
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

function removePost(id) {
  const isConfirmed = confirm("게시글을 삭제할까요?");

  if (!isConfirmed) {
    return;
  }

  deletePost(id);
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

postForm.addEventListener("submit", (event) => {
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
    updatePost(editingId, title, author, content);
  } else {
    createPost(title, author, content);
  }

  resetForm();
  renderPosts();
});

cancelButton.addEventListener("click", resetForm);

renderPosts();
