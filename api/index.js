// Vercel serverless function handler
// Este ficheiro é usado quando o backend é deployado como serverless function na Vercel

// Importar o app do backend
import app from '../backend/src/index.js';

// Exportar como handler para Vercel
export default app;
