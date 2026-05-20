const { pool } = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)`,
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "Register successful",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
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
      return res.status(400).json({
        message: "Email not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
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

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  register,
  login,
};