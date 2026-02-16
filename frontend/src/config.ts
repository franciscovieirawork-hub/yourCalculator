/**
 * Configuração da API
 * Em desenvolvimento: usa proxy do Vite (/api)
 * Em produção: 
 *   - Se VITE_API_URL estiver definida: usa URL completa do backend
 *   - Se não: assume que está no mesmo projeto Vercel e usa /api
 */
const VITE_API_URL_ENV = import.meta.env.VITE_API_URL;

// Validar e normalizar a URL da API
let API_BASE: string;
if (VITE_API_URL_ENV) {
  // Se começa com http, é URL completa
  if (VITE_API_URL_ENV.startsWith('http://') || VITE_API_URL_ENV.startsWith('https://')) {
    API_BASE = VITE_API_URL_ENV.endsWith('/') ? VITE_API_URL_ENV.slice(0, -1) : VITE_API_URL_ENV;
  } else {
    // Se não começa com http, assumir que falta o protocolo e adicionar https://
    const normalized = VITE_API_URL_ENV.startsWith('//') ? `https:${VITE_API_URL_ENV}` : `https://${VITE_API_URL_ENV}`;
    API_BASE = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  }
} else {
  // Fallback para desenvolvimento ou mesmo projeto
  API_BASE = '/api';
}

export function apiUrl(path: string): string {
  // Garantir que path começa com /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Se API_BASE já é uma URL completa (produção com backend separado)
  if (API_BASE.startsWith('http://') || API_BASE.startsWith('https://')) {
    // Se já termina com /api, usar diretamente
    if (API_BASE.endsWith('/api')) {
      return `${API_BASE}${cleanPath}`;
    }
    // Se não tem /api, adicionar
    return `${API_BASE}/api${cleanPath}`;
  }
  
  // Se é /api (desenvolvimento com proxy ou mesmo projeto Vercel)
  return `${API_BASE}${cleanPath}`;
}

export const API_BASE_URL = API_BASE;
