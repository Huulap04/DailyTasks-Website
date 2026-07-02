import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api.js";
import "./Home.css";
import { useAuth } from "../../Context/AuthContext.jsx";
import TodoFilter from "../../components/TodoFilter.jsx";
import TodoModal from "../../components/TodoModal.jsx";
import { Logo } from "../../components/icons.jsx";
import { TrashBox } from "../../components/icons.jsx";
import TodoDetail from "../../components/TodoDetail.jsx";
import TodoBadges from "../../components/TodoBadges.jsx";

function Home() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

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

  const addTodo = async (data) => {
    await API.post("/todos", {
      title: data.title,
      note: data.note || null,
      reminder: data.reminder || null,
      priority: data.priority || null,
      category: data.category || null,
    });

    loadTodos();
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

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };
  const filteredTodos = todos
    .filter((todo) => {
      if (filterType === "active") return !todo.completed;
      if (filterType === "done") return todo.completed;
      return true;
    })
    .filter((todo) => todo.title.toLowerCase().includes(keyword.toLowerCase()));

  const editTodo = async (id, data) => {
    await API.patch(`/todos/${id}`, data);
    loadTodos();
    setSelectedTodo(null);
  };

  return (
    <main className={`todo-page ${darkMode ? "dark" : ""}`}>
      <div className="todo-wrapper">
        <header className="todo-header">
          <div>
            <Logo />

            <h1>Daily Tasks</h1>

            <div className="user-email">
              <i className="fa-regular fa-user"></i>
              <span>{user?.username || "User"}</span>
            </div>
          </div>
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            <i
              className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}
            ></i>
            {darkMode ? "" : ""}
          </button>

          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        </header>

        <section className="todo-card">
          <div className="control-top">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass"></i>

              <input
                type="text"
                placeholder="Search tasks..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <button className="add-btn" onClick={() => setShowModal(true)}>
              <i className="fa-solid fa-plus"></i>
              Add
            </button>
          </div>

          <div className="card-line"></div>

          <div className="control-area">
            <div className="filter-row">
              <TodoFilter
                filterType={filterType}
                setFilterType={setFilterType}
              />
            </div>
          </div>

          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <div key={todo.id}>
                <li className="todo-item">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                  />

                  <div
                    className="todo-content"
                    onClick={() => setSelectedTodo(todo)}
                  >
                    <span
                      style={{
                        textDecoration: todo.completed
                          ? "line-through"
                          : "none",
                        fontSize: "20px",
                      }}
                    >
                      {todo.title}

                      {todo.priority === "Cao" && (
                        <i
                          className="fa-solid fa-star urgent-star"
                          style={{
                            color: "#ef4444",
                            marginLeft: "8px",
                            fontSize: "13px",
                          }}
                        ></i>
                      )}
                    </span>

                    <TodoBadges todo={todo} />

                    {/* Hiện thời gian tạo ghi chú  */}
                    {/* {todo.created_at && (
                      <div className="todo-meta">
                        <i className="fa-regular fa-clock"></i>
                        Created:{" "}
                        {new Date(todo.created_at).toLocaleString("vi-VN")}
                      </div>
                    )} */}
                  </div>
                  <button
                    className="delete-btn-home"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTodo(todo.id);
                    }}
                  >
                    <TrashBox />
                  </button>
                </li>
              </div>
            ))}
          </ul>
        </section>
        <TodoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={addTodo}
        />
        <TodoDetail
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onUpdate={editTodo}
          onDelete={deleteTodo}
          toggleTodo={toggleTodo}
        />
      </div>
    </main>
  );
}

export default Home;
