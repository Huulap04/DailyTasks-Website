const CATEGORIES = ["Công việc", "Cá nhân", "Mua sắm", "Sức khỏe", "Khác"];
const PRIORITIES = ["Thấp", "Trung bình", "Cao"];

function TaskFormFields({ form, onChange, idPrefix = "task" }) {
  return (
    <div className="task-form-fields">
      <label htmlFor={`${idPrefix}-title`}>Tiêu đề công việc <em>*</em>
        <input id={`${idPrefix}-title`} name="title" value={form.title} onChange={onChange} placeholder="Nhập tên việc cần làm rõ ràng..." required />
      </label>
      <label htmlFor={`${idPrefix}-note`}>Mô tả chi tiết
        <textarea id={`${idPrefix}-note`} name="note" value={form.note} onChange={onChange} placeholder="Ghi chú, yêu cầu hoặc thông tin hữu ích..." rows="4" />
      </label>
      <div className="task-form-fields__grid">
        <label htmlFor={`${idPrefix}-category`}>Danh mục
          <select id={`${idPrefix}-category`} name="category" value={form.category} onChange={onChange}>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label htmlFor={`${idPrefix}-priority`}>Mức độ ưu tiên
          <select id={`${idPrefix}-priority`} name="priority" value={form.priority} onChange={onChange}>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
      </div>
      <label htmlFor={`${idPrefix}-reminder`}>Hạn hoàn thành
        <input id={`${idPrefix}-reminder`} type="datetime-local" name="reminder" value={form.reminder} onChange={onChange} />
      </label>
    </div>
  );
}

export default TaskFormFields;
