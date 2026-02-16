import { Router } from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { CALCULATOR_LIST } from '../data/calculators.js';

export const calculatorsRouter = Router();

// Endpoint de teste sem middleware (para debug)
calculatorsRouter.get('/test', (req, res) => {
  res.json({ message: 'Calculators router working', calculators: CALCULATOR_LIST.length });
});

// Endpoint completamente público sem middleware (para debug)
calculatorsRouter.get('/public', (req, res) => {
  res.json({
    calculators: CALCULATOR_LIST,
    profile: null,
    message: 'Public endpoint - no auth middleware',
  });
});

// Lista de calculadoras (público; opcionalmente enriquecido com perfil para prefill)
calculatorsRouter.get('/', optionalAuth, async (req, res) => {
  try {
    console.log('GET /calculators - user:', req.user ? req.user.id : 'null');
    console.log('GET /calculators - headers:', JSON.stringify(req.headers));
    res.json({
      calculators: CALCULATOR_LIST,
      profile: req.user?.profile ?? null,
    });
  } catch (error) {
    console.error('Error in GET /calculators:', error);
    res.status(500).json({ error: 'Erro ao carregar calculadoras' });
  }
});

// Metadados de uma calculadora por slug
calculatorsRouter.get('/:slug', (req, res) => {
  const calc = CALCULATOR_LIST.find((c) => c.slug === req.params.slug);
  if (!calc) return res.status(404).json({ error: 'Calculadora não encontrada' });
  res.json(calc);
});
