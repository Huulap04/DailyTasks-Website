function AppLogo({ compact = false }) {
  return (
    <div className={`app-logo ${compact ? "app-logo--compact" : ""}`}>
      <span className="app-logo__mark" aria-hidden="true"><i className="fa-solid fa-check"></i></span>
      {!compact && (
        <span className="app-logo__copy">
          <strong>Daily Tasks</strong>
          <small>Năng suất mỗi ngày</small>
        </span>
      )}
    </div>
  );
}

export default AppLogo;
