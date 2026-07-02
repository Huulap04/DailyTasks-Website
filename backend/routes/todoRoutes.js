const express = require("express");

const router = express.Router();

const {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  editTodo,
} = require("../controller/todoController");

router.get("/", getTodos);

router.post("/", addTodo);

router.put("/:id", updateTodo);

router.delete("/:id", deleteTodo);

router.patch("/:id", editTodo);

module.exports = router;