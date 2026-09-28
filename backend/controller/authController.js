const { pool } = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/http");

//============Register===========
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check Mail
    const checkMail = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkMail.rows.length > 0) {
      return sendError(res, 409, "EMAIL_ALREADY_EXISTS", "Email đã được sử dụng.");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)`,
      [username, email, hashedPassword]
    );

    return res.status(201).json({
      message: "Register successful",
    });
  } catch (err) {
    if (err.code === "23505") {
      return sendError(res, 409, "EMAIL_ALREADY_EXISTS", "Email đã được sử dụng.");
    }
    return sendError(res, 500, "INTERNAL_ERROR", "Không thể đăng ký tài khoản.");
  }
};

//=========Login===============
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return sendError(res, 401, "INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng.");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendError(res, 401, "INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng.");
    }

    // Create Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    return sendError(res, 500, "INTERNAL_ERROR", "Không thể đăng nhập.");
  }
};

module.exports = {
  register,
  login,
};
