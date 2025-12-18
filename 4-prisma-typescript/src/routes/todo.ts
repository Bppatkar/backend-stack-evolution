import { Router } from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.ts';
import { authenticate } from '../middleware/auth.ts';
import { validateTodo } from '../middleware/validation.ts';

const router = Router();

router.use(authenticate);

router.get('/', getAllTodos);
router.get('/:id', getTodoById);
router.post('/', validateTodo, createTodo);
router.put('/:id', validateTodo, updateTodo);
router.delete('/:id', deleteTodo);

export default router;
