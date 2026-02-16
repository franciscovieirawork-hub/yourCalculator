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

// Normalizar FRONTEND_URL para garantir que está na lista
if (FRONTEND_URL && !FRONTEND_URL.startsWith('http')) {
  allowedOrigins.push(`https://${FRONTEND_URL}`);
}

// Log para debug (remover em produção se necessário)
console.log('CORS allowed origins:', allowedOrigins);
console.log('FRONTEND_URL:', FRONTEND_URL);

// Handler manual para OPTIONS (preflight) antes do CORS
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  console.log('OPTIONS preflight from:', origin);
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 horas
    return res.sendStatus(200);
  }
  res.sendStatus(403);
});

app.use(cors({ 
  origin: (origin, callback) => {
    // Log para debug
    console.log('CORS request from origin:', origin);
    // Permitir requests sem origin (mobile apps, Postman, etc) ou se estiver na lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Por agora permitir todas para debug
      console.log('Allowing origin (not in list):', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Para alguns browsers antigos
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
