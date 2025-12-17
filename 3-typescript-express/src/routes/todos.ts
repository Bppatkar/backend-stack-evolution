import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
} from '../controllers/todoController';

const router = Router();

// All todo routes require authentication
router.use(authMiddleware);

router.get('/', getTodos);
router.get('/:id', getTodoById);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
