import Joi from 'joi';
import prisma from '../lib/prisma.js';

const todoSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional(),
});
export const getTodos = async (req, res) => {
  try {
    // Raw SQL query
    /* 
      const result = await pool.query(
      'SELECT t.*, u.name as user_name, u.email as user_email FROM todos t JOIN users u ON t.user_id = u.id WHERE t.user_id = $1',
      [userId]
      );
     */
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.id },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, todos });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todo.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json({
      success: true,
      todo,
    });
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { error, value } = todoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { title, description } = value;
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId: req.user.id,
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      todo,
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = todoSchema.validate(req.body, {
      allowUnknown: false,
      presence: 'optional',
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const todo = await prisma.todo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...(value.title !== undefined && { title: value.title }),
        ...(value.description !== undefined && {
          description: value.description,
        }),
      },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      todo,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Todo not found' });
    }
    console.error('Update todo error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    

    const { id } = req.params;
    await prisma.todo.delete({
      where: { id: parseInt(id), userId: req.user.id },
    });

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Todo not found' });
    }
    console.error('Delete todo error:', error);
    res.status(500).json({ error: error.message });
  }
};
