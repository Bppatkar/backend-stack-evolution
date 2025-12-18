import type { Response, Request } from 'express';
import prisma from '../lib/prisma.ts';

import type { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: JwtPayload & { id: string };
}
interface TodoInput {
  title: string;
  content?: string;
  completed?: boolean;
}

interface UpdateTodoInput {
  title?: string;
  content?: string;
  completed?: boolean;
}

export const getAllTodos = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const userId = req.user?.id;

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
    });

    res.json(todos);
  } catch (error) {
    console.error('Get all todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTodoById = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Get todo by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTodo = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, content, completed }: TodoInput = req.body;

    const todo = await prisma.todo.create({
      data: {
        title,
        content,
        completed: completed || false,
        userId,
      },
    });

    res.status(201).json({
      message: 'Todo created successfully',
      todo,
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTodo = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, content, completed }: UpdateTodoInput = req.body;

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(completed !== undefined && { completed }),
      },
    });

    res.json({
      message: 'Todo updated successfully',
      todo,
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTodo = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await prisma.todo.delete({
      where: { id },
    });

    res.json({
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
