import { useEffect, useState } from "react";
import "./TodoDetail.css";
import { TrashBox } from "./icons.jsx";

function TodoDetail({ todo, onClose, onUpdate, onDelete, toggleTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    note: "",
    reminder: "",
    priority: "Trung bình",
    category: "Khác",
  });

  useEffect(() => {
    if (todo) {
      setForm({
        title: todo.title || "",
        note: todo.note || "",
        reminder: todo.reminder ? todo.reminder.slice(0, 16) : "",
        priority: todo.priority || "Trung bình",
        category: todo.category || "Khác",
      });
      setIsEditing(false);
    }
  }, [todo]);

  if (!todo) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    onUpdate(todo.id, form);
  };

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>
          ×
        </button>

        <h2 className="detail-title">Task Detail</h2>

        <div className="detail-section">
          <span className="detail-label">Title</span>
          {isEditing ? (
            <input
              className="detail-input"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          ) : (
            <h3>{todo.title}</h3>
          )}
        </div>

        <div className="detail-section">
          <span className="detail-label">Note</span>
          {isEditing ? (
            <textarea
              className="detail-textarea"
              name="note"
              value={form.note}
              onChange={handleChange}
            />
          ) : (
            <p>{todo.note || "No note"}</p>
          )}
        </div>

        <div className="detail-info-row">
          <div className="detail-info-box">
            <span className="detail-label">Ưu tiên</span>
            {isEditing ? (
              <select
                className="detail-input"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>Thấp</option>
                <option>Trung bình</option>
                <option>Cao</option>
              </select>
            ) : (
              <p>{todo.priority || "Trung bình"}</p>
            )}
          </div>

          <div className="detail-info-box">
            <span className="detail-label">Danh mục</span>
            {isEditing ? (
              <select
                className="detail-input"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Công việc</option>
                <option>Cá nhân</option>
                <option>Mua sắm</option>
                <option>Sức khỏe</option>
                <option>Khác</option>
              </select>
            ) : (
              <p>{todo.category || "Khác"}</p>
            )}
          </div>
        </div>

        <div className="detail-section">
          <span className="detail-label">Reminder</span>
          {isEditing ? (
            <input
              className="detail-input"
              type="datetime-local"
              name="reminder"
              value={form.reminder}
              onChange={handleChange}
            />
          ) : (
            <p>
              {todo.reminder
                ? new Date(todo.reminder).toLocaleString("vi-VN")
                : "No reminder"}
            </p>
          )}
        </div>

        {todo.created_at && (
          <div className="detail-section">
            <span className="detail-label">Created</span>
            <p>{new Date(todo.created_at).toLocaleString("vi-VN")}</p>
          </div>
        )}

        {isEditing ? (
          <div className="detail-actions">
            <button
              className="detail-btn edit-btn"
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </button>

            <button className="detail-btn done-btn" onClick={handleSave}>
              Lưu
            </button>
          </div>
        ) : (
          <div className="detail-actions">
            <button
              className="detail-btn edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Sửa
            </button>

            <button
              className="detail-btn done-btn"
              onClick={() => {
                toggleTodo(todo.id, todo.completed);
                onClose();
              }}
            >
              Hoàn thành
            </button>

            <button
              className="detail-btn delete-btn"
              onClick={() => {
                onDelete(todo.id);
                onClose();
              }}
            >
              <TrashBox />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoDetail;
