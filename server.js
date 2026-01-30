const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'User-Todo Management System API is running',
    endpoints: {
      users: {
        signup: 'POST /api/users/signup'
      },
      todos: {
        create: 'POST /api/todos/add-todo',
        getUserTodos: 'GET /api/todos/get-my-todo/:userId',
        update: 'PUT /api/todos/update-todo/:todoId',
        delete: 'DELETE /api/todos/delete-todo/:todoId'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}`);
});

module.exports = app;
