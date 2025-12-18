import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.ts';
import { authenticate } from '../middleware/auth.ts';
import { validateRegister, validateLogin } from '../middleware/validation.ts';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);

export default router;
