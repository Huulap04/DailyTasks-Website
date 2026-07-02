import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api";
import "./auth.css";
import PasswordInput from "../../components/PassWordInput";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      alert("Đăng ký thành công");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng ký thất bại");
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

            <div>
              <h1>Đăng ký</h1>
              <p>Tạo tài khoản để bắt đầu ghi chú công việc</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="username">Tên người dùng</label>

              <div className="input-box">
                <i className="fa-regular fa-user"></i>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Tên của bạn"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
              <PasswordInput
                  value={form.password}
                  onChange={handleChange}
                  name="password"
                />  
            </div>

            <button type="submit" className="submit-btn">
              <span>Đăng ký</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>

          <p className="switch-text">
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>

        <div className="auth-panel note-panel">
          <div className="paper-note main-note">
            <span className="pin"></span>
            <p className="note-label">New journey</p>
            <h2>Bắt đầu quản lý ngày của bạn tốt hơn 🌱</h2>

            <ul>
              <li>
                <i className="fa-solid fa-check"></i>
                Tạo tài khoản
              </li>
              <li>
                <i className="fa-solid fa-check"></i>
                Thêm công việc đầu tiên
              </li>
              <li>
                <i className="fa-regular fa-circle"></i>
                Hoàn thành mục tiêu
              </li>
            </ul>
          </div>

          <div className="mini-note note-a">
            <i className="fa-regular fa-calendar-check"></i>
            <span>Lên kế hoạch gọn gàng</span>
          </div>

          <div className="mini-note note-b">
            <i className="fa-regular fa-heart"></i>
            <span>Làm việc nhẹ nhàng</span>
          </div>

          <div className="quote-card">
            “Todo nhỏ hôm nay là thành quả lớn ngày mai.”
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
