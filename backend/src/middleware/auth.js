import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });
    if (!user) return res.status(401).json({ error: 'Utilizador não encontrado' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

export async function optionalAuth(req, res, next) {
  // OPTIONS requests não devem passar por autenticação
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  req.user = null;
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.slice(7);
    if (!token) {
      return next();
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded?.userId) {
        return next();
      }
      
      try {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          include: { profile: true },
        });
        if (user) {
          req.user = user;
        }
      } catch (dbError) {
        // Erro na base de dados - continua sem autenticação
        console.error('Database error in optionalAuth:', dbError);
      }
    } catch (tokenError) {
      // Token inválido - continua sem autenticação
    }
  } catch (error) {
    console.error('Unexpected error in optionalAuth:', error);
  }
  
  return next();
}
