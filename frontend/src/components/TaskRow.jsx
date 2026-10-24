import TodoBadges from "./TodoBadges.jsx";
import { TrashBox } from "./icons.jsx";

function TaskRow({ todo, isOverdue, isBulkMode, isSelected, onToggle, onSelect, onOpen, onDelete }) {
  return (
    <li className={`task-row ds-card ${isOverdue ? "task-row--overdue" : ""} ${todo.completed ? "task-row--completed" : ""}`}>
      {isBulkMode ? (
        <button className={`task-row__check ${isSelected ? "is-selected" : ""}`} type="button" aria-label={`${isSelected ? "Bỏ chọn" : "Chọn"} ${todo.title}`} aria-pressed={isSelected} onClick={onSelect}>
          <i className={isSelected ? "fa-solid fa-square-check" : "fa-regular fa-square"} />
        </button>
      ) : (
        <label className="task-row__check">
          <input type="checkbox" checked={todo.completed} aria-label={`Đánh dấu ${todo.title} là hoàn thành`} onChange={onToggle} />
          <i className="fa-solid fa-check" aria-hidden="true" />
        </label>
      )}

      <button className="task-row__content" type="button" onClick={onOpen}>
        <span className="task-row__title">{todo.title}</span>
        <TodoBadges todo={todo} />
      </button>

      <button className="task-row__delete" type="button" aria-label={`Xóa ${todo.title}`} onClick={onDelete}><TrashBox /></button>
    </li>
  );
}

export default TaskRow;
