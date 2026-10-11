import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api.js";
import "./Home.css";
import { useAuth } from "../../Context/useAuth";
import TodoFilter from "../../components/TodoFilter.jsx";
import TodoModal from "../../components/TodoModal.jsx";
import { Logo, TrashBox } from "../../components/icons.jsx";
import TodoDetail from "../../components/TodoDetail.jsx";
import TodoBadges from "../../components/TodoBadges.jsx";

const PAGE_SIZE = 8;
const priorityOrder = { Cao: 0, "Trung bình": 1, Thấp: 2 };

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

const isToday = (date) => {
  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
};

const isOverdue = (todo) =>
  !todo.completed && todo.reminder && new Date(todo.reminder) < new Date();

function Home() {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [priority, setPriority] = useState("all");
  const [category, setCategory] = useState("all");
  const [deadline, setDeadline] = useState("all");
  const [sortBy, setSortBy] = useState("created_desc");
  const [keyword, setKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [undoTodo, setUndoTodo] = useState(null);
  const undoTimer = useRef(null);

  const loadTodos = useCallback(async () => {
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

  useEffect(() => () => clearTimeout(undoTimer.current), []);

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
      setTodos((currentTodos) => currentTodos.map((todo) => (
        todo.id === id ? { ...todo, completed: !completed } : todo
      )));
      return true;
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể cập nhật công việc."));
      return false;
    }
  };

  const deleteTodo = async (id, { confirm = true, allowUndo = true } = {}) => {
    const todoToDelete = todos.find((todo) => todo.id === id);
    if (!todoToDelete) return false;
    if (confirm && !window.confirm(`Xóa công việc “${todoToDelete.title}”?`)) return false;

    setActionError("");
    try {
      await API.delete(`/todos/${id}`);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
      setSelectedIds((currentIds) => currentIds.filter((todoId) => todoId !== id));

      if (allowUndo) {
        clearTimeout(undoTimer.current);
        setUndoTodo(todoToDelete);
        undoTimer.current = setTimeout(() => setUndoTodo(null), 6000);
      }
      return true;
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể xóa công việc."));
      return false;
    }
  };

  const undoDelete = async () => {
    if (!undoTodo) return;
    const todoToRestore = undoTodo;
    setUndoTodo(null);
    clearTimeout(undoTimer.current);

    try {
      const response = await API.post("/todos", {
        title: todoToRestore.title,
        note: todoToRestore.note,
        reminder: todoToRestore.reminder,
        priority: todoToRestore.priority,
        category: todoToRestore.category,
      });
      setTodos((currentTodos) => [response.data.todo, ...currentTodos]);
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể khôi phục công việc."));
    }
  };

  const editTodo = async (id, data) => {
    setActionError("");
    try {
      const response = await API.patch(`/todos/${id}`, data);
      setTodos((currentTodos) => currentTodos.map((todo) => (
        todo.id === id ? response.data.todo : todo
      )));
      setSelectedTodo(null);
      return true;
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể lưu thay đổi."));
      return false;
    }
  };

  const filteredTodos = useMemo(() => {
    const now = new Date();
    return todos
      .filter((todo) => filterType === "all" || (filterType === "active" ? !todo.completed : todo.completed))
      .filter((todo) => priority === "all" || todo.priority === priority)
      .filter((todo) => category === "all" || todo.category === category)
      .filter((todo) => todo.title.toLowerCase().includes(keyword.toLowerCase()))
      .filter((todo) => {
        if (deadline === "all") return true;
        if (deadline === "none") return !todo.reminder;
        if (!todo.reminder) return false;
        const reminder = new Date(todo.reminder);
        if (deadline === "overdue") return isOverdue(todo);
        if (deadline === "today") return isToday(reminder);
        return reminder >= now && !isToday(reminder);
      })
      .sort((first, second) => {
        if (sortBy === "priority_desc") {
          return (priorityOrder[first.priority] ?? 3) - (priorityOrder[second.priority] ?? 3);
        }
        if (sortBy === "reminder_asc") {
          return new Date(first.reminder || "9999-12-31") - new Date(second.reminder || "9999-12-31");
        }
        if (sortBy === "title_asc") return first.title.localeCompare(second.title, "vi");
        return new Date(second.created_at) - new Date(first.created_at);
      });
  }, [category, deadline, filterType, keyword, priority, sortBy, todos]);

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedTodos = filteredTodos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allVisibleSelected = paginatedTodos.length > 0 && paginatedTodos.every((todo) => selectedIds.includes(todo.id));
  const overdueCount = todos.filter(isOverdue).length;
  const activeCount = todos.filter((todo) => !todo.completed).length;

  const toggleSelection = (id) => {
    setSelectedIds((currentIds) => (
      currentIds.includes(id) ? currentIds.filter((todoId) => todoId !== id) : [...currentIds, id]
    ));
  };

  const toggleVisibleSelection = () => {
    const visibleIds = paginatedTodos.map((todo) => todo.id);
    setSelectedIds((currentIds) => (
      allVisibleSelected
        ? currentIds.filter((id) => !visibleIds.includes(id))
        : [...new Set([...currentIds, ...visibleIds])]
    ));
  };

  const completeSelected = async () => {
    const todoIds = selectedIds.filter((id) => todos.some((todo) => todo.id === id && !todo.completed));
    if (todoIds.length === 0) return;
    setActionError("");
    try {
      await Promise.all(todoIds.map((id) => API.put(`/todos/${id}`, { completed: true })));
      setTodos((currentTodos) => currentTodos.map((todo) => (
        todoIds.includes(todo.id) ? { ...todo, completed: true } : todo
      )));
      setSelectedIds([]);
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể hoàn thành các công việc đã chọn."));
      loadTodos();
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0 || !window.confirm(`Xóa ${selectedIds.length} công việc đã chọn?`)) return;
    setActionError("");
    try {
      await Promise.all(selectedIds.map((id) => API.delete(`/todos/${id}`)));
      setTodos((currentTodos) => currentTodos.filter((todo) => !selectedIds.includes(todo.id)));
      setSelectedIds([]);
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể xóa các công việc đã chọn."));
      loadTodos();
    }
  };

  return (
    <main className={`todo-page ${darkMode ? "dark" : ""}`}>
      <div className="todo-wrapper">
        <header className="todo-header">
          <div>
            <Logo />
            <h1>Daily Tasks</h1>
            <div className="user-email"><i className="fa-regular fa-user"></i><span>{user?.username || "User"}</span></div>
          </div>
          <button className="theme-btn" type="button" aria-label={darkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"} onClick={() => setDarkMode((currentMode) => !currentMode)}>
            <i className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
          </button>
          <button className="logout-btn" type="button" onClick={() => { logout(); navigate("/", { replace: true }); }}>
            <i className="fa-solid fa-right-from-bracket"></i>Logout
          </button>
        </header>

        <section className="todo-card" aria-busy={isLoading}>
          <div className="control-top">
            <div className="search-box"><i className="fa-solid fa-magnifying-glass"></i><input type="search" placeholder="Search tasks..." aria-label="Tìm kiếm công việc" value={keyword} onChange={(event) => setKeyword(event.target.value)} /></div>
            <button className="add-btn" type="button" onClick={() => setShowModal(true)}><i className="fa-solid fa-plus"></i>Add</button>
          </div>
          <div className="card-line"></div>
          <div className="control-area">
            <div className="todo-summary"><span>{activeCount} đang làm</span><span className={overdueCount ? "summary-overdue" : ""}>{overdueCount} quá hạn</span></div>
            <div className="filter-row">
              <TodoFilter {...{ filterType, setFilterType, priority, setPriority, category, setCategory, deadline, setDeadline, sortBy, setSortBy }} />
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="bulk-bar">
              <span>Đã chọn {selectedIds.length} công việc</span>
              <button type="button" onClick={completeSelected}><i className="fa-solid fa-check"></i>Hoàn thành</button>
              <button className="bulk-delete" type="button" onClick={deleteSelected}><TrashBox />Xóa</button>
              <button type="button" onClick={() => setSelectedIds([])}>Bỏ chọn</button>
            </div>
          )}
          {actionError && <p className="todo-feedback" role="alert">{actionError}</p>}

          <ul className="todo-list">
            {isLoading && <li className="empty-todo">Đang tải công việc...</li>}
            {!isLoading && loadError && <li className="empty-todo error-state" role="alert"><span>{loadError}</span><button type="button" onClick={loadTodos}>Thử lại</button></li>}
            {!isLoading && !loadError && filteredTodos.length === 0 && <li className="empty-todo">{todos.length === 0 ? "Chưa có công việc nào. Hãy thêm công việc đầu tiên!" : "Không có công việc phù hợp."}</li>}
            {!isLoading && !loadError && paginatedTodos.length > 0 && (
              <li className="select-all-row"><label><input type="checkbox" checked={allVisibleSelected} onChange={toggleVisibleSelection} />Chọn tất cả trên trang này</label></li>
            )}
            {!isLoading && !loadError && paginatedTodos.map((todo) => (
              <li className={`todo-item ${isOverdue(todo) ? "is-overdue" : ""}`} key={todo.id}>
                <label className="select-todo"><input type="checkbox" checked={selectedIds.includes(todo.id)} onChange={() => toggleSelection(todo.id)} /><span className="sr-only">Chọn {todo.title}</span></label>
                <input type="checkbox" checked={todo.completed} aria-label={`Đánh dấu ${todo.title} là hoàn thành`} onChange={() => toggleTodo(todo.id, todo.completed)} />
                <button className="todo-content" type="button" onClick={() => setSelectedTodo(todo)}>
                  <span style={{ textDecoration: todo.completed ? "line-through" : "none", fontSize: "20px" }}>{todo.title}{todo.priority === "Cao" && <i className="fa-solid fa-star urgent-star" aria-label="Ưu tiên cao"></i>}</span>
                  <TodoBadges todo={todo} />
                </button>
                <button className="delete-btn-home" type="button" aria-label={`Xóa ${todo.title}`} onClick={() => deleteTodo(todo.id)}><TrashBox /></button>
              </li>
            ))}
          </ul>

          {!isLoading && !loadError && filteredTodos.length > PAGE_SIZE && (
            <nav className="pagination" aria-label="Phân trang công việc">
              <button type="button" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Trước</button>
              <span>Trang {currentPage}/{totalPages}</span>
              <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Sau</button>
            </nav>
          )}
        </section>

        {undoTodo && <div className="undo-toast" role="status"><span>Đã xóa “{undoTodo.title}”.</span><button type="button" onClick={undoDelete}>Hoàn tác</button></div>}
        <TodoModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={addTodo} />
        <TodoDetail key={selectedTodo?.id || "no-selected-todo"} todo={selectedTodo} onClose={() => setSelectedTodo(null)} onUpdate={editTodo} onDelete={deleteTodo} toggleTodo={toggleTodo} />
      </div>
    </main>
  );
}

export default Home;
