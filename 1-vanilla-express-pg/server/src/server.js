import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
// import './config/database.js';
import pool from './config/database.js';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';

const app = express();
const PORT = process.env.PORT || 7000;
const allowedOrigins = [
  'http://localhost:5173',
  'https://backend-stack-evolution.vercel.app',
  'https://backend-stack-evolution.vercel.app/',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        const originWithoutSlash = origin.endsWith('/')
          ? origin.slice(0, -1)
          : origin + '/';

        if (allowedOrigins.indexOf(originWithoutSlash) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT NOW() as time, version() as version'
    );
    res.json({
      status: 'Database connected',
      time: result.rows[0].time,
      version: result.rows[0].version,
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
    });
  }
});

// Add this BEFORE your routes in server.js
app.get('/api/init-db', async (req, res) => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create todos table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    res.json({
      success: true,
      message: 'Tables created successfully',
    });
  } catch (error) {
    console.error('Init DB error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

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
