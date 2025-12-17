import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getTodos);
router.get('/:id', getTodoById);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
