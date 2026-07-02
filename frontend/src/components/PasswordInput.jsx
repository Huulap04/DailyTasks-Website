import { useState } from "react";

function PasswordInput({
  value,
  onChange,
  name = "password",
  placeholder = "••••••••",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-box">
      <i className="fa-solid fa-lock"></i>

      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />

      <i
        className={`fa-regular ${
          showPassword ? "fa-eye-slash" : "fa-eye"
        } eye-icon`}
        onClick={() => setShowPassword(!showPassword)}
      ></i>
    </div>
  );
}

export default PasswordInput;