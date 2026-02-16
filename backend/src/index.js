import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { profileRouter } from './routes/profile.js';
import { documentsRouter } from './routes/documents.js';
import { calculatorsRouter } from './routes/calculators.js';

const app = express();

app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/calculators', calculatorsRouter);

app.get('/api/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
}

export default app;
