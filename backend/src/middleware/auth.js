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
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded?.userId) {
      req.user = null;
      return next();
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
}
