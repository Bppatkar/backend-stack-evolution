import { Request, Response } from 'express';
import pool from '../config/database';

interface TodoBody {
  title: string;
  description?: string;
}

interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export const getTodos = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const result = await pool.query(
      `SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json({ todos: result.rows });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTodoById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const todoId = parseInt(req.params.id);

    if (isNaN(todoId)) {
      res.status(400).json({ error: 'Invalid todo ID' });
      return;
    }

    const result = await pool.query(
      `SELECT * FROM todos WHERE id = $1 AND user_id = $2`,
      [todoId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json({ todo: result.rows[0] });
  } catch (error) {
    console.error('Get todo by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { title, description } = req.body as TodoBody;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO todos (title, description, user_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [title, description || null, userId]
    );

    res.status(201).json({ todo: result.rows[0] });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const todoId = parseInt(req.params.id);
    const { title, description, completed } = req.body;

    // Check if todo exists and belongs to user
    const todoCheck = await pool.query(
      'SELECT id FROM todos WHERE id = $1 AND user_id = $2',
      [todoId, userId]
    );

    if (todoCheck.rows.length === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    const result = await pool.query(
      `UPDATE todos 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           completed = COALESCE($3, completed),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [title, description, completed, todoId, userId]
    );

    res.json({ todo: result.rows[0] });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const todoId = parseInt(req.params.id);

    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id',
      [todoId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};