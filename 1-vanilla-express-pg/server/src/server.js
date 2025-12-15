import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import './config/database.js';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';

const app = express();
const PORT = process.env.PORT || 7000;
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Todo API',
    version: '1.0.0',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (protected)',
      },
      todos: {
        getAll: 'GET /api/todos (protected)',
        getOne: 'GET /api/todos/:id (protected)',
        create: 'POST /api/todos (protected)',
        update: 'PUT /api/todos/:id (protected)',
        delete: 'DELETE /api/todos/:id (protected)',
        toggle: 'PATCH /api/todos/:id/toggle (protected)',
      },
    },
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.url,
    method: req.method,
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);

  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
