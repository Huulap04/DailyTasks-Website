const express = require("express");

const router = express.Router();

const {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  editTodo,
} = require("../controller/todoController");
const {
  validateCompleted,
  validateId,
  validateTodo,
} = require("../middleware/validateRequest");

router.get("/", getTodos);

router.post("/", validateTodo, addTodo);

router.put("/:id", validateId, validateCompleted, updateTodo);

router.delete("/:id", validateId, deleteTodo);

router.patch("/:id", validateId, validateTodo, editTodo);

module.exports = router;
