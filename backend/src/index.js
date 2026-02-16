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

// Middleware CORS manual - ADICIONAR HEADERS EM TODAS AS RESPOSTAS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('Request from origin:', origin);
  
  // Adicionar headers CORS em TODAS as respostas
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // Permitir todas as origens temporariamente
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Max-Age', '86400');
  
  // Responder imediatamente a OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS preflight - returning 200');
    return res.sendStatus(200);
  }
  
  next();
});

// CORS middleware adicional (backup)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Allowing origin (not in list):', origin);
      callback(null, true);
    }
  },
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
