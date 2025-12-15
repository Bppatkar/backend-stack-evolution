import pool from '../config/database.js';

// Get all todos for a user
export const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    // console.log('Fetching todos for user ID:', userId);
    const result = await pool.query(
      `SELECT * FROM todos
      WHERE user_id = $1
      ORDER BY
        completed ASC, created_at DESC`,
      [userId]
    );
    res.status(200).json({
      todos: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      error: 'Server error fetching todos',
    });
  }
};

// Get single todo
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT * FROM todos WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }
    res.status(200).json({
      todo: result.rows[0],
    });
  } catch (error) {
    console.error('Error in getting todos by id: ', error.message);
    res.status(500).json({
      error: 'Server error fetching todos',
    });
  }
};

// Create new todo
export const createTodo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description } = req.body || {};

    if (!title || title.trim() === '') {
      return res.status(400).json({
        error: 'Title is required',
      });
    }

    const result = await pool.query(
      `INSERT INTO todos (title, description, user_id)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [title.trim(), description?.trim(), userId]
    );

    res.status(201).json({
      message: 'Todo created successfully',
      todo: result.rows[0],
    });
  } catch (error) {
    console.error('Error in creating todos by ', error.message);
    res.status(500).json({
      error: 'Server error fetching todos',
    });
  }
};

// Update todo
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const userId = req.user.userId;

    // Check if todo exists and belongs to user
    const checkResult = await pool.query(
      'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title.trim());
      paramCount++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description?.trim());
      paramCount++;
    }

    if (completed !== undefined) {
      updates.push(`completed = $${paramCount}`);
      values.push(completed);
      paramCount++;
    }

    // Always update updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add WHERE clause parameters
    values.push(id, userId);

    const query = `
      UPDATE todos
      SET ${updates.join(', ')}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      message: 'Todo updated successfully',
      todo: result.rows[0],
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      error: 'Server error updating todo',
    });
  }
};

// Delete todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if todo exists and belongs to user
    const checkResult = await pool.query(
      'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }

    await pool.query('DELETE FROM todos WHERE id = $1 AND user_id = $2', [
      id,
      userId,
    ]);

    res.status(200).json({
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      error: 'Server error deleting todo',
    });
  }
};

// Toggle todo completion status
export const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `UPDATE todos
       SET completed = NOT completed,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }

    res.status(200).json({
      message: 'Todo toggled successfully',
      todo: result.rows[0],
    });
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({
      error: 'Server error toggling todo',
    });
  }
};
