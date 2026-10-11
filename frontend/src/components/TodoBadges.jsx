function TodoBadges({ todo }) {
  const reminder = todo.reminder ? new Date(todo.reminder) : null;
  const isOverdue = reminder && !todo.completed && reminder < new Date();
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Công việc":
        return "fa-solid fa-briefcase";
      case "Cá nhân":
        return "fa-regular fa-user";
      case "Mua sắm":
        return "fa-solid fa-cart-shopping";
      case "Sức khỏe":
        return "fa-solid fa-heart-pulse";
      default:
        return "fa-solid fa-tag";
    }
  };

  return (
    <div className="todo-badges">
      <span className="todo-badge category-badge">
        <i className={getCategoryIcon(todo.category)}></i>
        {todo.category || "Khác"}
      </span>

      {reminder && (
        <span className={`todo-badge date-badge ${isOverdue ? "overdue-badge" : ""}`}>
          <i className="fa-regular fa-calendar"></i>
          {isOverdue ? "Quá hạn: " : ""}{reminder.toLocaleDateString("vi-VN")}
        </span>
      )}
    </div>
  );
}

export default TodoBadges;
