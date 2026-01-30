const supabase = require('../config/supabase');

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create todo
    const { data: newTodo, error: todoError } = await supabase
      .from('todos')
      .insert([
        {
          title: title.trim(),
          description: description ? description.trim() : null,
          user_id: userId
        }
      ])
      .select()
      .single();

    if (todoError) {
      console.error('Database error:', todoError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create todo',
        error: todoError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo
    });

  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all todos for a specific user
const getUserTodos = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's todos
    const { data: todos, error: todosError } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (todosError) {
      console.error('Database error:', todosError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch todos',
        error: todosError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todos fetched successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      count: todos.length,
      data: todos
    });

  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update a todo
const updateTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { title, description, is_completed } = req.body;

    // Check if todo exists
    const { data: existingTodo, error: checkError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', todoId)
      .single();

    if (checkError || !existingTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    // Prepare update object
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (is_completed !== undefined) updateData.is_completed = is_completed;

    // Update todo
    const { data: updatedTodo, error: updateError } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', todoId)
      .select()
      .single();

    if (updateError) {
      console.error('Database error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update todo',
        error: updateError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    });

  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete a todo
const deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params;

    // Check if todo exists
    const { data: existingTodo, error: checkError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', todoId)
      .single();

    if (checkError || !existingTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    // Delete todo
    const { error: deleteError } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId);

    if (deleteError) {
      console.error('Database error:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete todo',
        error: deleteError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: existingTodo
    });

  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createTodo,
  getUserTodos,
  updateTodo,
  deleteTodo
};
