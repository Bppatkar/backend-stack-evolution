import Joi from 'joi';
import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: JwtPayload & { id: string };
}

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const todoSchema = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().optional(),
  completed: Joi.boolean().optional(),
});

export const validateRegister = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: error.details[0]?.message || 'Validation failed' });
  }
  next();
};

export const validateLogin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: error.details[0]?.message || 'Validation failed' });
  }
  next();
};

export const validateTodo = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const { error } = todoSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: error.details[0]?.message || 'Validation failed' });
  }
  next();
};
