import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth';
import todoRoutes from './routes/todos';

const app: Express = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'TypeScript Express API',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error: Error, _req: Request, res: Response, _next: Function) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
