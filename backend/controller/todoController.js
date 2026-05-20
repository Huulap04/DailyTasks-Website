const { pool } = require("../db/db");

// ===== GET TODOS =====
const getTodos = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM todos WHERE "userId" = $1 ORDER BY id DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ===== ADD TODO =====
const addTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    await pool.query(
      `INSERT INTO todos (title, completed, "userId")
       VALUES ($1, $2, $3)`,
      [title, false, userId]
    );

    res.json({
      message: "Todo added",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ===== TOGGLE TODO =====
const updateTodo = async (req, res) => {
  try {
    const { completed } = req.body;
    const userId = req.user.id;
    const todoId = req.params.id;

    await pool.query(
      `UPDATE todos
       SET completed = $1
       WHERE id = $2 AND "userId" = $3`,
      [completed, todoId, userId]
    );

    res.json({
      message: "Todo updated",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ===== DELETE TODO =====
const deleteTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;

    await pool.query(
      `DELETE FROM todos
       WHERE id = $1 AND "userId" = $2`,
      [todoId, userId]
    );

    res.json({
      message: "Todo deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};