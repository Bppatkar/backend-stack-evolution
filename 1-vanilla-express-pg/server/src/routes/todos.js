import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from '../controllers/todoController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET all todos
router.get('/', getTodos);

// GET single todo
router.get('/:id', getTodoById);

// POST create new todo
router.post('/', createTodo);

// PUT update todo
router.put('/:id', updateTodo);

// PATCH toggle todo completion (alternative to PUT)
router.patch('/:id/toggle', toggleTodo);

// DELETE todo
router.delete('/:id', deleteTodo);

export default router;
