import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

export const documentsRouter = Router();

documentsRouter.use(authMiddleware);

documentsRouter.get('/', async (req, res) => {
  try {
    const list = await prisma.savedDocument.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        calculatorId: true,
        calculatorName: true,
        createdAt: true,
      },
    });
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao listar documentos' });
  }
});

documentsRouter.post('/', async (req, res) => {
  try {
    const { title, calculatorId, calculatorName, content } = req.body;
    if (!title || !calculatorId || !calculatorName || content === undefined) {
      return res.status(400).json({ error: 'Faltam campos: title, calculatorId, calculatorName, content' });
    }
    const doc = await prisma.savedDocument.create({
      data: {
        userId: req.user.id,
        title: String(title).slice(0, 255),
        calculatorId: String(calculatorId).slice(0, 100),
        calculatorName: String(calculatorName).slice(0, 255),
        content: typeof content === 'string' ? content : JSON.stringify(content),
      },
    });
    res.status(201).json({
      id: doc.id,
      title: doc.title,
      calculatorId: doc.calculatorId,
      calculatorName: doc.calculatorName,
      createdAt: doc.createdAt,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao guardar documento' });
  }
});

documentsRouter.get('/:id', async (req, res) => {
  try {
    const doc = await prisma.savedDocument.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });
    res.json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao obter documento' });
  }
});

documentsRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.savedDocument.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao eliminar documento' });
  }
});
