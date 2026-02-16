import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { profileRouter } from './routes/profile.js';
import { documentsRouter } from './routes/documents.js';
import { calculatorsRouter } from './routes/calculators.js';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS: permitir frontend em produção e desenvolvimento
const allowedOrigins = [
  FRONTEND_URL,
  'https://atuacalcoladora.vercel.app',
  'https://yourcalculator-frontend.vercel.app',
  'https://your-calculator-black.vercel.app',
  'http://localhost:5173',
];

// Log para debug (remover em produção se necessário)
console.log('CORS allowed origins:', allowedOrigins);
console.log('FRONTEND_URL:', FRONTEND_URL);

app.use(cors({ 
  origin: (origin, callback) => {
    // Permitir requests sem origin (mobile apps, Postman, etc) ou se estiver na lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Por agora permitir todas para debug
    }
  },
  credentials: true 
}));
app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/calculators', calculatorsRouter);

app.get('/api/health', (_, res) => res.json({ ok: true }));

// Vercel serverless functions não precisam de listen()
// Mas em desenvolvimento local sim
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
}

// Exportar para Vercel
export default app;
