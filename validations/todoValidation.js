const validator = require('validator');

const validateCreateTodo = (req, res, next) => {
  const { title, userId } = req.body;

  // Validate required fields
  if (!title || !userId) {
    return res.status(400).json({
      success: false,
      message: 'Title and userId are required'
    });
  }

  // Validate title
  if (title.trim().length < 1) {
    return res.status(400).json({
      success: false,
      message: 'Title cannot be empty'
    });
  }

  // Validate userId is a valid UUID
  if (!validator.isUUID(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid userId format'
    });
  }

  next();
};

const validateUpdateTodo = (req, res, next) => {
  const { title, description, is_completed } = req.body;

  // At least one field should be provided for update
  if (title === undefined && description === undefined && is_completed === undefined) {
    return res.status(400).json({
      success: false,
      message: 'At least one field (title, description, or is_completed) must be provided for update'
    });
  }

  // Validate title if provided
  if (title !== undefined && title.trim().length < 1) {
    return res.status(400).json({
      success: false,
      message: 'Title cannot be empty'
    });
  }

  // Validate is_completed if provided
  if (is_completed !== undefined && typeof is_completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'is_completed must be a boolean value'
    });
  }

  next();
};

const validateTodoId = (req, res, next) => {
  const { todoId } = req.params;

  if (!validator.isUUID(todoId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid todo ID format'
    });
  }

  next();
};

const validateUserId = (req, res, next) => {
  const { userId } = req.params;

  if (!validator.isUUID(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format'
    });
  }

  next();
};

module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId,
  validateUserId
};
