import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api.js";
import "./Home.css";
import "./sidebar.css";
import { useAuth } from "../../Context/useAuth";
import TodoFilter from "../../components/TodoFilter.jsx";
import TodoModal from "../../components/TodoModal.jsx";
import TodoDetail from "../../components/TodoDetail.jsx";
import AppLogo from "../../components/AppLogo.jsx";
import TaskStats from "../../components/TaskStats.jsx";
import TaskRow from "../../components/TaskRow.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

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
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [deleteRequest, setDeleteRequest] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [undoTodo, setUndoTodo] = useState(null);
  const undoTimer = useRef(null);
  const searchInputRef = useRef(null);

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
    if (confirm) {
      setDeleteRequest({ type: "single", todo: todoToDelete });
      return false;
    }

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
    if (selectedIds.length === 0) return;
    setDeleteRequest({ type: "multiple", count: selectedIds.length });
  };

  const confirmDelete = async () => {
    if (!deleteRequest) return;
    if (deleteRequest.type === "single") {
      const request = deleteRequest;
      setDeleteRequest(null);
      await deleteTodo(request.todo.id, { confirm: false });
      return;
    }

    setDeleteRequest(null);
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

  const exitBulkMode = () => {
    setSelectedIds([]);
    setIsBulkMode(false);
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <main className={`workspace ${darkMode ? "workspace--dark" : ""} ${isSidebarCollapsed ? "workspace--sidebar-collapsed" : ""}`}>
      <aside className="workspace-sidebar">
        <div className="sidebar-brand"><AppLogo /><button className="sidebar-toggle" type="button" aria-label="Thu gọn điều hướng" onClick={() => setIsSidebarCollapsed((current) => !current)}><i className="fa-solid fa-chevron-left" /></button></div>
        <p className="sync-status"><i className="fa-solid fa-circle" /> Đã lưu trực tuyến</p>
        <p className="sidebar-label">Không gian làm việc</p>
        <nav className="sidebar-nav" aria-label="Điều hướng công việc">
          <button className="is-active" type="button"><i className="fa-regular fa-calendar-days" />Hôm nay</button>
          <button type="button" onClick={() => setIsBulkMode(true)}><i className="fa-solid fa-list-check" />Thao tác hàng loạt</button>
          <button type="button" onClick={() => setShowModal(true)}><i className="fa-solid fa-circle-plus" />Thêm công việc</button>
        </nav>
        <div className="sidebar-account"><span className="avatar">{(user?.username || "U").slice(0, 1).toUpperCase()}</span><span><strong>{user?.username || "Thành viên"}</strong><small>{user?.email || "Tài khoản Daily Tasks"}</small></span></div>
      </aside>

      <section className="workspace-main">
        <header className="workspace-topbar">
          <button className="mobile-logo" type="button" aria-label="Daily Tasks" onClick={() => setIsSidebarCollapsed((current) => !current)}><AppLogo compact /></button>
          <nav className="workspace-tabs" aria-label="Chế độ xem"><button className="is-active" type="button">Hôm nay</button><button type="button">Sắp tới</button><button type="button">Đã xong</button></nav>
          <div className="topbar-actions">
            <button className="icon-button workspace-search-button" type="button" aria-label="Tìm kiếm công việc" onClick={() => searchInputRef.current?.focus()}><i className="fa-solid fa-magnifying-glass" /></button>
            <button className="icon-button" type="button" aria-label={darkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"} onClick={() => setDarkMode((current) => !current)}><i className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"} /></button>
            <button className="account-button" type="button" onClick={() => { logout(); navigate("/", { replace: true }); }}><span className="avatar">{(user?.username || "U").slice(0, 1).toUpperCase()}</span><span className="account-button__label">Đăng xuất</span><i className="fa-solid fa-arrow-right-from-bracket" /></button>
          </div>
        </header>

        <div className="workspace-content" aria-busy={isLoading}>
          <section className="workspace-intro"><div><p>Không gian cá nhân</p><h1>Chào {user?.username || "bạn"}, hôm nay làm gì?</h1></div><span>{new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" })}</span></section>
          <div className="workspace-banner"><span><i className="fa-solid fa-cloud-arrow-up" /> Đồng bộ đám mây • Trực tuyến</span><span className="workspace-banner__hint">Mọi thay đổi được lưu tự động</span></div>

          <TaskStats activeCount={activeCount} completedCount={completedCount} overdueCount={overdueCount} totalCount={todos.length} />

          <section className="task-board ds-card">
            <div className="task-board__controls">
              <label className="task-search"><i className="fa-solid fa-magnifying-glass" /><input ref={searchInputRef} type="search" placeholder="Tìm kiếm công việc nhanh..." aria-label="Tìm kiếm công việc" value={keyword} onChange={(event) => setKeyword(event.target.value)} /></label>
              <div className="task-board__actions">
                <div className="more-actions"><button className="icon-button" type="button" aria-label="Mở thêm thao tác" aria-expanded={isMoreMenuOpen} onClick={() => setIsMoreMenuOpen((isOpen) => !isOpen)}><i className="fa-solid fa-ellipsis" /></button>{isMoreMenuOpen && <div className="more-actions-menu" role="menu"><button type="button" role="menuitem" onClick={() => { setIsBulkMode(true); setIsMoreMenuOpen(false); }}><i className="fa-regular fa-square-check" />Chọn nhiều công việc</button></div>}</div>
                <button className="primary-button ds-button ds-button--primary" type="button" onClick={() => setShowModal(true)}><i className="fa-solid fa-plus" />Thêm công việc</button>
              </div>
            </div>
            <div className="task-board__filters"><TodoFilter {...{ filterType, setFilterType, priority, setPriority, category, setCategory, deadline, setDeadline, sortBy, setSortBy }} /></div>

            {isBulkMode && <div className="bulk-toolbar"><strong>{selectedIds.length ? `Đã chọn ${selectedIds.length} công việc` : "Chọn các công việc cần thao tác"}</strong><div><button type="button" disabled={!selectedIds.length} onClick={completeSelected}><i className="fa-solid fa-check" />Hoàn thành</button><button className="danger" type="button" disabled={!selectedIds.length} onClick={deleteSelected}><i className="fa-solid fa-trash" />Xóa</button><button type="button" onClick={exitBulkMode}>Xong</button></div></div>}
            {actionError && <p className="todo-feedback" role="alert">{actionError}</p>}

            <div className="task-list-header"><div className="task-view-tabs"><span className="is-active">Tất cả ({filteredTodos.length})</span><span>Đang làm ({activeCount})</span><span>Đã xong ({completedCount})</span></div><span>Sắp xếp: <strong>{sortBy === "reminder_asc" ? "Hạn gần nhất" : "Mới tạo"}</strong></span></div>
            <ul className="task-list">
              {isLoading && <li className="empty-todo">Đang tải công việc...</li>}
              {!isLoading && loadError && <li className="empty-todo error-state" role="alert"><span>{loadError}</span><button type="button" onClick={loadTodos}>Thử lại</button></li>}
              {!isLoading && !loadError && filteredTodos.length === 0 && <li className="empty-todo"><i className="fa-regular fa-clipboard" />{todos.length === 0 ? "Chưa có công việc nào. Hãy thêm công việc đầu tiên!" : "Không có công việc phù hợp."}</li>}
              {!isLoading && !loadError && isBulkMode && paginatedTodos.length > 0 && <li className="select-all-row"><label><input type="checkbox" checked={allVisibleSelected} onChange={toggleVisibleSelection} />Chọn tất cả trên trang này</label></li>}
              {!isLoading && !loadError && paginatedTodos.map((todo) => <TaskRow key={todo.id} todo={todo} isOverdue={isOverdue(todo)} isBulkMode={isBulkMode} isSelected={selectedIds.includes(todo.id)} onToggle={() => toggleTodo(todo.id, todo.completed)} onSelect={() => toggleSelection(todo.id)} onOpen={() => setSelectedTodo(todo)} onDelete={() => deleteTodo(todo.id)} />)}
            </ul>
            {!isLoading && !loadError && filteredTodos.length > PAGE_SIZE && <nav className="pagination" aria-label="Phân trang công việc"><button type="button" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Trước</button><span>Trang {currentPage}/{totalPages}</span><button type="button" disabled={currentPage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Sau</button></nav>}
          </section>
        </div>
      </section>
      {undoTodo && <div className="undo-toast" role="status"><span>Đã xóa “{undoTodo.title}”.</span><button type="button" onClick={undoDelete}>Hoàn tác</button></div>}
      <TodoModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={addTodo} />
      <TodoDetail key={selectedTodo?.id || "no-selected-todo"} todo={selectedTodo} onClose={() => setSelectedTodo(null)} onUpdate={editTodo} onDelete={deleteTodo} toggleTodo={toggleTodo} />
      <ConfirmDialog isOpen={Boolean(deleteRequest)} title={deleteRequest?.type === "multiple" ? `Xóa ${deleteRequest.count} công việc?` : "Xóa công việc này?"} description={deleteRequest?.type === "multiple" ? "Các công việc đã chọn sẽ bị xóa và không thể hoàn tác bằng thao tác hàng loạt." : `“${deleteRequest?.todo?.title || ""}” sẽ bị xóa. Bạn có thể hoàn tác trong vài giây sau khi xóa.`} confirmLabel={deleteRequest?.type === "multiple" ? "Xóa tất cả" : "Xóa công việc"} onConfirm={confirmDelete} onClose={() => setDeleteRequest(null)} />
    </main>
  );
}

export default Home;
