const priorities = ["all", "Cao", "Trung bình", "Thấp"];
const categories = ["all", "Công việc", "Cá nhân", "Mua sắm", "Sức khỏe", "Khác"];

function TodoFilter({
  filterType,
  setFilterType,
  priority,
  setPriority,
  category,
  setCategory,
  deadline,
  setDeadline,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="filter-controls" aria-label="Bộ lọc công việc">
      <label className="filter-box">
        <i className="fa-solid fa-filter"></i>
        <span className="sr-only">Trạng thái</span>
        <select value={filterType} onChange={(event) => setFilterType(event.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang làm</option>
          <option value="done">Đã hoàn thành</option>
        </select>
      </label>

      <label className="filter-box">
        <i className="fa-solid fa-flag"></i>
        <span className="sr-only">Ưu tiên</span>
        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
          {priorities.map((item) => (
            <option key={item} value={item}>{item === "all" ? "Mọi ưu tiên" : item}</option>
          ))}
        </select>
      </label>

      <label className="filter-box">
        <i className="fa-solid fa-tag"></i>
        <span className="sr-only">Danh mục</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>{item === "all" ? "Mọi danh mục" : item}</option>
          ))}
        </select>
      </label>

      <label className="filter-box">
        <i className="fa-regular fa-calendar"></i>
        <span className="sr-only">Hạn công việc</span>
        <select value={deadline} onChange={(event) => setDeadline(event.target.value)}>
          <option value="all">Mọi thời hạn</option>
          <option value="overdue">Quá hạn</option>
          <option value="today">Hôm nay</option>
          <option value="upcoming">Sắp tới</option>
          <option value="none">Chưa có hạn</option>
        </select>
      </label>

      <label className="filter-box sort-box">
        <i className="fa-solid fa-arrow-down-wide-short"></i>
        <span className="sr-only">Sắp xếp</span>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="created_desc">Mới tạo</option>
          <option value="reminder_asc">Hạn gần nhất</option>
          <option value="priority_desc">Ưu tiên cao</option>
          <option value="title_asc">Tên A–Z</option>
        </select>
      </label>
    </div>
  );
}

export default TodoFilter;
