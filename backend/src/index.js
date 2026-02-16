import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { profileRouter } from './routes/profile.js';
import { documentsRouter } from './routes/documents.js';
import { calculatorsRouter } from './routes/calculators.js';

const app = express();

// CORS configurado dinamicamente baseado em variáveis de ambiente
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [
  FRONTEND_URL,
  'https://atuacalcoladora.vercel.app',
  'https://yourcalculator-frontend.vercel.app',
  'https://your-calculator-black.vercel.app',
  'http://localhost:5173',
];

console.log('CORS allowed origins:', allowedOrigins);
console.log('FRONTEND_URL:', FRONTEND_URL);

// CORS com origem dinâmica
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sem origin (mobile apps, Postman, etc)
    if (!origin) {
      return callback(null, true);
    }
    // Verificar se está na lista de origens permitidas
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Por agora permitir todas para debug
      console.log('Allowing origin (not in list):', origin);
      callback(null, true);
    }
  },
  credentials: false, // Não usar credentials com wildcard
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/calculators', calculatorsRouter);

app.get('/api/health', (_, res) => res.json({ ok: true }));

// Vercel serverless functions não precisam de listen()
// Mas em desenvolvimento local sim
const PORT = process.env.PORT || 3001;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
}

// Exportar para Vercel
export default app;
