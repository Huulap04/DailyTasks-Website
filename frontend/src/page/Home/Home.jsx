import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api.js";
import "./Home.css";
import { useAuth } from "../../Context/AuthContext.jsx";

function Home() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [keyword, setKeyword] = useState("");

  const token = localStorage.getItem("token");

  const { user, logout } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/welcome");
      return;
    }

    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const res = await API.get("/todos");
      setTodos(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Loading failed");
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;

    try {
      await API.post("/todos", {
        title: title.trim(),
      });

      setTitle("");
      loadTodos();
    } catch (err) {
      alert(err.response?.data?.message || "Add failed");
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await API.put(`/todos/${id}`, {
        completed: !completed,
      });

      loadTodos();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      loadTodos();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const clearComplete = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    try {
      for (const todo of completedTodos) {
        await API.delete(`/todos/${todo.id}`);
      }

      loadTodos();
    } catch (err) {
      alert(err.response?.data?.message || "Clear failed");
    }
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filterType === "active") return !todo.completed;
      if (filterType === "done") return todo.completed;
      return true;
    })
    .filter((todo) => todo.title.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <main className="todo-page">
      <div className="todo-wrapper">
        <header className="todo-header">
          <div>
            <h1>Daily Tasks</h1>

            <div className="user-email">
              <i className="fa-regular fa-user"></i>
              <span>{user?.username || "User"}</span>
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        </header>

        <section className="todo-card">
          <div className="add-row">
            <input
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
            />

            <button className="add-btn" onClick={addTodo}>
              <i className="fa-solid fa-plus"></i>
              Add
            </button>
          </div>

          <div className="card-line"></div>

          <div className="control-area">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search tasks..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="filter-row">
              <button
                className={`filter-btn ${filterType === "all" ? "active" : ""}`}
                onClick={() => setFilterType("all")}
              >
                All
              </button>

              <button
                className={`filter-btn ${filterType === "active" ? "active" : ""}`}
                onClick={() => setFilterType("active")}
              >
                Active
              </button>

              <button
                className={`filter-btn ${filterType === "done" ? "active" : ""}`}
                onClick={() => setFilterType("done")}
              >
                Done
              </button>

              <button className="filter-btn danger" onClick={clearComplete}>
                Clear Completed
              </button>
            </div>
          </div>

          <ul className="todo-list">
            {filteredTodos.length === 0 ? (
              <li className="empty-todo">No tasks found</li>
            ) : (
              filteredTodos.map((todo) => (
                <li className="todo-item" key={todo.id}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                  />

                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      fontSize: "20px",
                    }}
                  >
                    {todo.title}
                  </span>

                  <button
                    className="btn btn-secondary btn-sm ms-2 mb-2"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Clear
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}

export default Home;
