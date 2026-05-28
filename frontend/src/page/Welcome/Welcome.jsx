import { Link } from "react-router-dom";
import "./welcome.css";

function Welcome() {
  return (
    <main className="welcome-page">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <section className="hero">
        <div className="app-icon-wrap">
          <div className="app-icon">
            <i className="fa-regular fa-square-check"></i>
          </div>
        </div>

        <h1>Chào mừng đến với Todo</h1>

        <p className="subtitle">
          Quản lý công việc một cách thông minh, hiệu quả và đơn giản. Biến ý
          tưởng thành hành động mỗi ngày.
        </p>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon green">
              <i className="fa-regular fa-circle-check"></i>
            </div>

            <h3>Dễ sử dụng</h3>
            <p>Giao diện trực quan, thao tác nhanh chóng</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon purple">
              <i className="fa-regular fa-star"></i>
            </div>

            <h3>Thông minh</h3>
            <p>Tổ chức công việc khoa học và hiệu quả</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon orange">
              <i className="fa-solid fa-bolt"></i>
            </div>

            <h3>Đầy đủ tính năng</h3>
            <p>Mọi công cụ bạn cần trong một ứng dụng</p>
          </article>
        </div>

        <div className="hero-actions">
          <Link to="/register" className="btn btn-light">
            <span>Bắt đầu ngay</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>

          <Link to="/login" className="btn btn-outline">
            <span>Đăng nhập</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Welcome;
