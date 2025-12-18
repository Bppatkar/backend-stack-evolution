import express, { Request } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.ts';
import todoRoutes from './routes/todo.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/health', (req: Request, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((req: Request, res) => {
  res.status(404).json({ error: 'Route not found' });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
