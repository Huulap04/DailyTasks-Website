const API_URL = "https://dailytasks-website.onrender.com";
// ===== DATA =====
let todos = [];
let filterType = "all";
const searchInput = document.getElementById("searchInput");
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "./login.html";
}

window.onload = function () {
  loadTodos();
};

//===========Hàm dùng chung=====
function authToken() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
// ===== Load từ db lên =====
async function loadTodos() {
  try {
    const res = await axios.get(`${API_URL}/todos`, authToken());
    todos = res.data;
    renderTodos();
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message || " Loading failed");
  }
}

// ===== ADD TODO =====
async function addTodo() {
  const input = document.getElementById("todoInput");
  const value = input.value.trim();

  if (value === "") return;

  try {
    await axios.post(
      `${API_URL}/todos`,
      {
        title: value,
      },
      authToken(),
    );

    input.value = "";
    loadTodos();
  } catch (err) {
    console.log(err);
  }
}

// ===== RENDER =====
function renderTodos() {
  const list = document.getElementById("todoList");
  list.innerHTML = "";

  let filteredTodos = todos;

  if (filterType === "active") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  }

  if (filterType === "done") {
    filteredTodos = todos.filter((todo) => todo.completed);
  }
  const keyword = searchInput.value.trim().toLowerCase();
  if (keyword) {
    filteredTodos = filteredTodos.filter((todo) =>
      todo.title.toLowerCase().includes(keyword),
    );
  }

  filteredTodos.forEach((todo) => {
    list.innerHTML += `
      <li>
        <input
          type="checkbox"
          ${todo.completed ? "checked" : ""}
          onclick="toggleTodo(${todo.id}, ${todo.completed})"
        />
        <span style="${todo.completed ? "text-decoration: line-through; font-size: 20px; " : ""}">
          ${todo.title}
        </span>
        <button onclick="deleteTodo(${todo.id})" class="btn btn-secondary btn-sm ms-2 mb-2">Clear</button>
      </li>
    `;
  });
}

// ===== TOGGLE =====
async function toggleTodo(id, completed) {
  try {
    await axios.put(
      `${API_URL}/todos/${id}`,
      {
        completed: !completed,
      },
      authToken(),
    );
    await loadTodos();
  } catch (err) {
    console.log(err);
  }
}

// ===== DELETE =====
async function deleteTodo(id) {
  try {
    await axios.delete(`${API_URL}/todos/${id}`, authToken());
    await loadTodos();
  } catch (err) {
    console.log(err);
  }
}

// ===== FILTER =====
function setFilter(type) {
  filterType = type;
  renderTodos();
}

// ===== ENTER KEY =====
function handleEnter(event) {
  if (event.key === "Enter") {
    addTodo();
  }
}
// ===== CLEAR COMPLETED =====
async function clearComplete() {
  try {
    const completedTodos = todos.filter((todo) => todo.completed);
    for (const todo of completedTodos) {
      await axios.delete(`${API_URL}/todos/${todo.id}`, authToken());
    }
    loadTodos();
  } catch (err) {
    console.log(err);
  }
}

//==========logout===========
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "./Welcome.html";
  });
}

searchInput.addEventListener("input", renderTodos);
