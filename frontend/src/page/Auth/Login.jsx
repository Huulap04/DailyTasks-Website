import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api";
import "./auth.css";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      login(res.data.token, res.data.user);

      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-panel form-panel">
          <Link to="/" className="back-link">
            <i className="fa-solid fa-arrow-left"></i>
            Quay lại
          </Link>

          <div className="brand">
            <div className="brand-icon">
              <i className="fa-regular fa-square-check"></i>
            </div>

            <div className="title">
              <h1>Đăng nhập</h1>
              <p>Chào mừng bạn quay lại với Todo</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>

              <div className="input-box">
                <i className="fa-regular fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>

              <div className="input-box">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <i className="fa-regular fa-eye eye-icon"></i>
              </div>
            </div>

            <div className="form-row">
              <label className="remember">
                <input type="checkbox" />
                <span>Ghi nhớ tôi</span>
              </label>

              <a href="#" className="small-link">
                Quên mật khẩu?
              </a>
            </div>

            <button type="submit" className="submit-btn">
              <span>Đăng nhập</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>

          <p className="switch-text">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>

        <div className="auth-panel note-panel">
          <div className="paper-note main-note">
            <span className="pin"></span>
            <p className="note-label">Today plan</p>
            <h2>Biến việc cần làm thành việc đã xong ✨</h2>

            <ul>
              <li>
                <i className="fa-solid fa-check"></i>
                Học NodeJS
              </li>
              <li>
                <i className="fa-solid fa-check"></i>
                Làm Todo App
              </li>
              <li>
                <i className="fa-regular fa-circle"></i>
                Nghỉ ngơi một chút
              </li>
            </ul>
          </div>

          <div className="mini-note note-a">
            <i className="fa-regular fa-lightbulb"></i>
            <span>Ý tưởng nhỏ mỗi ngày</span>
          </div>

          <div className="mini-note note-b">
            <i className="fa-regular fa-star"></i>
            <span>Focus mode</span>
          </div>

          <div className="quote-card">
            “Một checklist rõ ràng giúp ngày của bạn nhẹ hơn.”
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
