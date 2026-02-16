import { Router } from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { CALCULATOR_LIST } from '../data/calculators.js';

export const calculatorsRouter = Router();

// Lista de calculadoras (público; opcionalmente enriquecido com perfil para prefill)
calculatorsRouter.get('/', optionalAuth, (req, res) => {
  res.json({
    calculators: CALCULATOR_LIST,
    profile: req.user?.profile ?? null,
  });
});

// Metadados de uma calculadora por slug
calculatorsRouter.get('/:slug', (req, res) => {
  const calc = CALCULATOR_LIST.find((c) => c.slug === req.params.slug);
  if (!calc) return res.status(404).json({ error: 'Calculadora não encontrada' });
  res.json(calc);
});
