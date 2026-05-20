const { pool } = require("../db/db");

// ===== GET TODOS =====
const getTodos = async (req, res) => {

  try {
    const userId = req.user.id;

    const result = await sql.query`
      SELECT * FROM Todos where userId = ${userId}
    `;

    res.json(result.recordset);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

// ===== ADD TODO =====
const addTodo = async (req, res) => {

  try {

    const { title } = req.body;
    const userId = req.user.id;

    await sql.query`
      INSERT INTO Todos(title, completed, userId)
      VALUES(${title},0, ${userId})
    `;

    res.json({
      message: "Todo added"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

// ===== TOGGLE TODO =====
const updateTodo = async (req, res) => {

  try {

    const { completed } = req.body;
    const userId = req.user.id;

    await sql.query`
      UPDATE Todos
      SET completed = ${completed}
      WHERE id = ${req.params.id} AND userId = ${userId}
    `;

    res.json({
      message: "Todo updated"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

// ===== DELETE TODO =====
const deleteTodo = async (req, res) => {

  try {
    const userId = req.user.id;

    await sql.query`
      DELETE FROM Todos
      WHERE id = ${req.params.id} AND userId = ${userId}
    `;

    res.json({
      message: "Todo deleted"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

module.exports = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo
};