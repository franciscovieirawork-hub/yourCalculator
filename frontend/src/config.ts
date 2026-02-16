/**
 * Configuração da API
 * Em desenvolvimento: usa proxy do Vite (/api)
 * Em produção: 
 *   - Se VITE_API_URL estiver definida: usa URL completa do backend
 *   - Se não: assume que está no mesmo projeto Vercel e usa /api
 */
const API_BASE = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.endsWith('/') ? import.meta.env.VITE_API_URL.slice(0, -1) : import.meta.env.VITE_API_URL)
  : '/api';

export function apiUrl(path: string): string {
  // Garantir que path começa com /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Se API_BASE já é uma URL completa (produção com backend separado)
  if (API_BASE.startsWith('http')) {
    const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
    // Se já termina com /api, usar diretamente
    if (base.endsWith('/api')) {
      return `${base}${cleanPath}`;
    }
    // Se não tem /api, adicionar
    return `${base}/api${cleanPath}`;
  }
  
  // Se é /api (desenvolvimento com proxy ou mesmo projeto Vercel)
  return `${API_BASE}${cleanPath}`;
}

export const API_BASE_URL = API_BASE;
