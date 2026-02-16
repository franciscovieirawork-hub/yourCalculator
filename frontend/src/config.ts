/**
 * Configuração da API
 * Em desenvolvimento: usa proxy do Vite (/api)
 * Em produção: usa URL completa se VITE_API_URL estiver definida
 */
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function apiUrl(path: string): string {
  if (path.startsWith('/')) {
    return API_BASE + path;
  }
  return `${API_BASE}/${path}`;
}

export const API_BASE_URL = API_BASE;
