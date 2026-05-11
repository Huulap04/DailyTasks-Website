const { sql } = require("../db/db");

// ===== GET TODOS =====
const getTodos = async (req, res) => {

  try {

    const result = await sql.query`
      SELECT * FROM Todos
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

    await sql.query`
      INSERT INTO Todos(title)
      VALUES(${title})
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

    await sql.query`
      UPDATE Todos
      SET completed = ${completed}
      WHERE id = ${req.params.id}
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

    await sql.query`
      DELETE FROM Todos
      WHERE id = ${req.params.id}
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