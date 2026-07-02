import { useState } from "react";
import "./TodoModal.css";

function TodoModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    note: "",
    reminder: "",
    priority: "Trung bình",
    category: "Khác",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;

    onSave(form);

    setForm({
      title: "",
      note: "",
      reminder: "",
      priority: "Trung bình",
      category: "Khác",
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="todo-modal">
        <h2 className="modal-title">
          <i className="fa-solid fa-pen"></i>
          New Task
        </h2>

        <label>Title</label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task name..."
        />

        <label>Note</label>

        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Write a note..."
        ></textarea>

        <div className="modal-select-row">
          <div className="select-box">
            <i className="fa-regular fa-flag"></i>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="Thấp">Thấp</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Cao">Cao</option>
            </select>
          </div>

          <div className="select-box">
            <i className="fa-regular fa-circle"></i>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="Công việc">Công việc</option>
              <option value="Cá nhân">Cá nhân</option>
              <option value="Mua sắm">Mua sắm</option>
              <option value="Sức khỏe">Sức khỏe</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>

        <label>
          <i className="fa-regular fa-clock"></i>
          Reminder
        </label>

        <input
          type="datetime-local"
          name="reminder"
          value={form.reminder}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="save" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoModal;
