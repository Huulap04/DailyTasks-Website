// ===== DATA =====
let todos = [];
let filterType = "all";
const searchInput = document.getElementById("searchInput");

window.onload = function () {
  loadTodos();
};

// ===== Load từ db lên =====
async function loadTodos() {
  try {
    const res = await axios.get("http://localhost:5000/todos");
    todos = res.data;
    renderTodos();
  } catch (err) {
    console.log(err);
  }
}

// ===== ADD TODO =====
async function addTodo() {
  const input = document.getElementById("todoInput");
  const value = input.value.trim();

  if (value === "") return;

  try {
    await axios.post("http://localhost:5000/todos", {
      title: value,
    });

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
    await axios.put(`http://localhost:5000/todos/${id}`, {
      completed: !completed,
    });
    await loadTodos();
  } catch (err) {
    console.log(err);
  }
}

// ===== DELETE =====
async function deleteTodo(id) {
  try {
    await axios.delete(`http://localhost:5000/todos/${id}`, {
    });
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
  try{
    const completedTodos = todos.filter(
      (todo) => todo.completed
    );
    for (const todo of completedTodos){
      await axios.delete(`http://localhost:5000/todos/${todo.id}`
      );
    }
    loadTodos();
  } catch (err){
    console.log(err);
  }
}

searchInput.addEventListener("input", renderTodos);
