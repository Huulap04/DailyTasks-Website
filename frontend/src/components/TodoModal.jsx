import { useState } from "react";
import "./TodoModal.css";
import TaskFormFields from "./TaskFormFields.jsx";

function TodoModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    note: "",
    reminder: "",
    priority: "Trung bình",
    category: "Khác",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    setError("");
    setIsSaving(true);
    const saved = await onSave(form);
    setIsSaving(false);

    if (!saved) {
      setError("Không thể lưu công việc. Vui lòng thử lại.");
      return;
    }

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
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <form className="todo-modal ds-card" aria-label="Thêm công việc" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <header className="todo-modal__header"><div><p>Tạo mới</p><h2>Thêm công việc</h2></div><button type="button" className="todo-modal__close" aria-label="Đóng" onClick={onClose}><i className="fa-solid fa-xmark" /></button></header>
        <TaskFormFields form={form} onChange={handleChange} />

        {error && <p className="modal-feedback" role="alert">{error}</p>}

        <footer className="modal-actions"><button className="ds-button ds-button--ghost cancel" type="button" onClick={onClose} disabled={isSaving}>Hủy bỏ</button><button className="ds-button ds-button--primary save" type="submit" disabled={isSaving}><i className="fa-solid fa-check" />{isSaving ? "Đang lưu..." : "Lưu công việc"}</button></footer>
      </form>
    </div>
  );
}

export default TodoModal;
