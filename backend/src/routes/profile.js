import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { validatePassword } from '../utils/password.js';

export const profileRouter = Router();

profileRouter.use(authMiddleware);

profileRouter.get('/', async (req, res) => {
  try {
    let profile = await prisma.userProfile.findUnique({
      where: { userId: req.user.id },
    });
    if (!profile) {
      profile = await prisma.userProfile.create({
        data: { userId: req.user.id },
      });
    }
    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao obter perfil' });
  }
});

profileRouter.put('/', async (req, res) => {
  try {
    const data = req.body;
    const allowed = [
      'taxSituation', 'numberOfDependents', 'irsRegime', 'region',
      'adse', 'irsJovem', 'mealAllowance', 'mealAllowanceTaxFree',
      'twelfthHoliday', 'twelfthChristmas', 'selfEmployed', 'activityCode', 'firstYearActivity',
      'municipality', 'municipalityTaxRate',
    ];
    const update = {};
    for (const key of allowed) {
      if (data[key] !== undefined) {
        if (key === 'numberOfDependents') update[key] = Math.max(0, parseInt(data[key], 10) || 0);
        else if (key === 'mealAllowance') update[key] = data[key] == null ? null : parseFloat(data[key]);
        else if (key === 'municipalityTaxRate') update[key] = data[key] == null ? null : parseFloat(data[key]);
        else if (key === 'adse' || key === 'irsJovem' || key === 'mealAllowanceTaxFree' || key === 'twelfthHoliday' || key === 'twelfthChristmas' || key === 'selfEmployed' || key === 'firstYearActivity') update[key] = !!data[key];
        else update[key] = data[key];
      }
    }
    const profile = await prisma.userProfile.upsert({
      where: { userId: req.user.id },
      create: { userId: req.user.id, ...update },
      update,
    });
    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

profileRouter.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Palavra-passe atual e nova palavra-passe obrigatórias' });
    }
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Palavra-passe atual incorreta' });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hash },
    });
    res.json({ message: 'Palavra-passe alterada com sucesso' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao alterar palavra-passe' });
  }
});
