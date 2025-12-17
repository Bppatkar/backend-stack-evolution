import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';
import prisma from './lib/prisma.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      timeStamp: new Date().toISOString(),
      service: 'Todo API with Prisma ORM',
      database: 'Connected',
    });
  } catch (error) {
    res.status(500).json({ database: 'Disconnected', error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res
    .status(err.status || 500)
    .json({ success: false, error: err.message || 'Internal server error' });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
