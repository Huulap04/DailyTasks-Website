function StatCard({ label, value, detail, tone, icon, progress }) {
  return (
    <article className={`task-stat ds-card task-stat--${tone}`}>
      <div className="task-stat__heading">
        <div>
          <p>{label}</p>
          <strong>{value}</strong>
          <span>{detail}</span>
        </div>
        <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
      </div>
      <span className="task-stat__progress"><span style={{ width: `${progress}%` }} /></span>
    </article>
  );
}

function TaskStats({ activeCount, completedCount, overdueCount, totalCount }) {
  const completion = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="task-stats" aria-label="Tổng quan công việc">
      <StatCard label="Đang thực hiện" value={activeCount} detail="Công việc cần tập trung" tone="primary" icon="fa-list-check" progress={totalCount ? Math.round((activeCount / totalCount) * 100) : 0} />
      <StatCard label="Đã hoàn thành" value={completedCount} detail={`${completion}% tiến độ tổng`} tone="success" icon="fa-circle-check" progress={completion} />
      <StatCard label="Cần giải quyết" value={overdueCount} detail={overdueCount ? "Có việc đã quá hạn" : "Không có việc quá hạn"} tone="danger" icon="fa-bell" progress={totalCount ? Math.round((overdueCount / totalCount) * 100) : 0} />
    </section>
  );
}

export default TaskStats;
