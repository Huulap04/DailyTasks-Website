import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api.js";
import "./Home.css";
import { useAuth } from "../../Context/useAuth";
import TodoFilter from "../../components/TodoFilter.jsx";
import TodoModal from "../../components/TodoModal.jsx";
import { Logo, TrashBox } from "../../components/icons.jsx";
import TodoDetail from "../../components/TodoDetail.jsx";
import TodoBadges from "../../components/TodoBadges.jsx";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

function Home() {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  const loadTodos = useCallback(async () => {
    // Defer state updates until after the effect that triggers this request has completed.
    await Promise.resolve();
    setIsLoading(true);
    setLoadError("");

    try {
      const res = await API.get("/todos");
      setTodos(res.data);
    } catch (error) {
      setLoadError(getErrorMessage(error, "Không thể tải danh sách công việc."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // This is an asynchronous server request; its state updates occur after the request settles.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTodos();
  }, [loadTodos, navigate, token]);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const addTodo = async (data) => {
    setActionError("");
    try {
      await API.post("/todos", {
        title: data.title,
        note: data.note || null,
        reminder: data.reminder || null,
        priority: data.priority || null,
        category: data.category || null,
      });
      await loadTodos();
      return true;
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể thêm công việc."));
      return false;
    }
  };

  const toggleTodo = async (id, completed) => {
    setActionError("");
    try {
      await API.put(`/todos/${id}`, { completed: !completed });
      await loadTodos();
      return true;
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể cập nhật công việc."));
      return false;
    }
  };

  const deleteTodo = async (id) => {
    setActionError("");
    try {
      await API.delete(`/todos/${id}`);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
      return true;
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể xóa công việc."));
      return false;
    }
  };

  const editTodo = async (id, data) => {
    setActionError("");
    try {
      await API.patch(`/todos/${id}`, data);
      await loadTodos();
      setSelectedTodo(null);
      return true;
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể lưu thay đổi."));
      return false;
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

          <button
            className="theme-btn"
            type="button"
            aria-label={darkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
            onClick={() => setDarkMode((currentMode) => !currentMode)}
          >
            <i className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
          </button>

          <button
            className="logout-btn"
            type="button"
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        </header>

        <section className="todo-card" aria-busy={isLoading}>
          <div className="control-top">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="search"
                placeholder="Search tasks..."
                aria-label="Tìm kiếm công việc"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>

            <button className="add-btn" type="button" onClick={() => setShowModal(true)}>
              <i className="fa-solid fa-plus"></i>
              Add
            </button>
          </div>

          <div className="card-line"></div>
          <div className="control-area">
            <div className="filter-row">
              <TodoFilter filterType={filterType} setFilterType={setFilterType} />
            </div>
          </div>

          {actionError && <p className="todo-feedback" role="alert">{actionError}</p>}

          <ul className="todo-list">
            {isLoading && <li className="empty-todo">Đang tải công việc...</li>}
            {!isLoading && loadError && (
              <li className="empty-todo error-state" role="alert">
                <span>{loadError}</span>
                <button type="button" onClick={loadTodos}>Thử lại</button>
              </li>
            )}
            {!isLoading && !loadError && filteredTodos.length === 0 && (
              <li className="empty-todo">
                {todos.length === 0 ? "Chưa có công việc nào. Hãy thêm công việc đầu tiên!" : "Không có công việc phù hợp."}
              </li>
            )}
            {!isLoading && !loadError && filteredTodos.map((todo) => (
              <li className="todo-item" key={todo.id}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  aria-label={`Đánh dấu ${todo.title} là hoàn thành`}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                />
                <button className="todo-content" type="button" onClick={() => setSelectedTodo(todo)}>
                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      fontSize: "20px",
                    }}
                  >
                    {todo.title}
                    {todo.priority === "Cao" && <i className="fa-solid fa-star urgent-star" aria-label="Ưu tiên cao"></i>}
                  </span>
                  <TodoBadges todo={todo} />
                </button>
                <button
                  className="delete-btn-home"
                  type="button"
                  aria-label={`Xóa ${todo.title}`}
                  onClick={() => deleteTodo(todo.id)}
                >
                  <TrashBox />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <TodoModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={addTodo} />
        <TodoDetail
          key={selectedTodo?.id || "no-selected-todo"}
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
