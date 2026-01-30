const express = require('express');
const router = express.Router();
const {
  createTodo,
  getUserTodos,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');
const {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId,
  validateUserId
} = require('../validations/todoValidation');

// POST /api/todos/add-todo - Create a new todo
router.post('/add-todo', validateCreateTodo, createTodo);

// GET /api/todos/get-my-todo/:userId - Get all todos for a user
router.get('/get-my-todo/:userId', validateUserId, getUserTodos);

// PUT /api/todos/update-todo/:todoId - Update a todo
router.put('/update-todo/:todoId', validateTodoId, validateUpdateTodo, updateTodo);

// DELETE /api/todos/delete-todo/:todoId - Delete a todo
router.delete('/delete-todo/:todoId', validateTodoId, deleteTodo);

module.exports = router;
