const { pool } = require("../db/db");

// ===== GET TODOS =====
const getTodos = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, title, note, reminder,priority,category, completed, created_at
   FROM todos
   WHERE "userId" = $1
   ORDER BY created_at DESC`,
      [userId],
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
    console.log("BODY BACKEND:", req.body);

    const { title, note, reminder } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      `INSERT INTO todos (title, note, reminder, priority, category, completed, "userId")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, note || null, reminder || null, req.body.priority || null, req.body.category || null, false, userId],
    );

    res.json({
      message: "Todo added",
      todo: result.rows[0],
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
      [completed, todoId, userId],
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
      [todoId, userId],
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
const editTodo = async (req, res) => {
  try {
    const { title, note, reminder, priority, category } = req.body;
    const userId = req.user.id;
    const todoId = req.params.id;

    const result = await pool.query(
      `UPDATE todos
       SET title = $1,
           note = $2,
           reminder = $3,
           priority = $4,
           category = $5
       WHERE id = $6 AND "userId" = $7
       RETURNING *`,
      [title, note || null, reminder || null, priority, category, todoId, userId]
    );

    res.json({ message: "Todo edited", todo: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  editTodo
};
