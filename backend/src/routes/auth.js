import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { validatePassword } from '../utils/password.js';
import { sendSMS, formatPhoneNumber, generateSMSCode } from '../services/sms.js';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, name, securityQuestion, securityAnswer, phoneNumber } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e palavra-passe obrigatórios' });
    }
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Número de telemóvel obrigatório' });
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }
    if (!securityQuestion || !securityAnswer) {
      return res.status(400).json({ error: 'Pergunta e resposta de segurança obrigatórias para recuperação de palavra-passe' });
    }
    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) return res.status(409).json({ error: 'Email já registado' });
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!formattedPhone) {
      return res.status(400).json({ error: 'Número de telemóvel inválido. Use formato: +351912345678 ou 912345678' });
    }
    const phoneExists = await prisma.user.findUnique({ where: { phoneNumber: formattedPhone } });
    if (phoneExists) return res.status(409).json({ error: 'Número de telemóvel já registado' });
    
    const hash = await bcrypt.hash(password, 10);
    const answerHash = await bcrypt.hash(securityAnswer.trim().toLowerCase(), 10);
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hash,
        name: name?.trim() || null,
        phoneNumber: formattedPhone, // Obrigatório
        securityQuestion: securityQuestion.trim(),
        securityAnswer: answerHash,
      },
      include: { profile: true },
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, profile: user.profile },
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao registar' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Palavra-passe obrigatória' });
    }
    if (!email && !phoneNumber) {
      return res.status(400).json({ error: 'Email ou número de telemóvel obrigatório' });
    }
    
    let user = null;
    if (email) {
      user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
        include: { profile: true },
      });
    } else if (phoneNumber) {
      const formatted = formatPhoneNumber(phoneNumber);
      if (!formatted) {
        return res.status(400).json({ error: 'Número de telemóvel inválido' });
      }
      user = await prisma.user.findUnique({
        where: { phoneNumber: formatted },
        include: { profile: true },
      });
    }
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais incorretas' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({
      user: { id: user.id, email: user.email, name: user.name, profile: user.profile },
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao iniciar sessão' });
  }
});

authRouter.get('/me', authMiddleware, (req, res) => {
  const u = req.user;
  res.json({
    user: {
      id: u.id,
      email: u.email,
      name: u.name,
      profile: u.profile,
    },
  });
});

// Verificar pergunta de segurança (para recuperação)
authRouter.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email obrigatório' });
    }
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, securityQuestion: true },
    });
    if (!user || !user.securityQuestion) {
      return res.status(404).json({ error: 'Email não encontrado ou sem pergunta de segurança configurada' });
    }
    res.json({ securityQuestion: user.securityQuestion });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao verificar email' });
  }
});

// Reset password com resposta de segurança
authRouter.post('/reset-password', async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({ error: 'Email, resposta de segurança e nova palavra-passe obrigatórios' });
    }
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user || !user.securityAnswer) {
      return res.status(404).json({ error: 'Email não encontrado' });
    }
    const answerMatch = await bcrypt.compare(securityAnswer.trim().toLowerCase(), user.securityAnswer);
    if (!answerMatch) {
      return res.status(401).json({ error: 'Resposta de segurança incorreta' });
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

// Enviar código SMS para recuperação
authRouter.post('/forgot-password-sms', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Número de telemóvel obrigatório' });
    }
    const formatted = formatPhoneNumber(phoneNumber);
    if (!formatted) {
      return res.status(400).json({ error: 'Número de telemóvel inválido' });
    }
    const user = await prisma.user.findUnique({
      where: { phoneNumber: formatted },
    });
    if (!user) {
      // Por segurança, não revelar se o número existe ou não
      return res.json({ message: 'Se o número estiver registado, receberá um código por SMS' });
    }
    
    // Limpar códigos antigos não usados
    await prisma.passwordResetCode.deleteMany({
      where: {
        userId: user.id,
        OR: [
          { used: true },
          { expiresAt: { lt: new Date() } },
        ],
      },
    });
    
    // Gerar novo código
    const code = generateSMSCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    
    await prisma.passwordResetCode.create({
      data: {
        userId: user.id,
        code: codeHash,
        phoneNumber: formatted,
        expiresAt,
      },
    });
    
    // Enviar SMS
    try {
      await sendSMS(formatted, `O seu código de recuperação YourCalculator: ${code}. Válido por 10 minutos.`);
      res.json({ message: 'Código enviado por SMS' });
    } catch (smsError) {
      console.error('Erro ao enviar SMS:', smsError);
      // Não falhar o request se SMS falhar (em dev pode não estar configurado)
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ error: 'Erro ao enviar SMS. Tente novamente.' });
      }
      // Em dev, retornar o código diretamente (apenas para testes!)
      res.json({ message: 'Código enviado por SMS', devCode: code });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao processar pedido' });
  }
});

// Verificar código SMS e reset password
authRouter.post('/reset-password-sms', async (req, res) => {
  try {
    const { phoneNumber, code, newPassword } = req.body;
    if (!phoneNumber || !code || !newPassword) {
      return res.status(400).json({ error: 'Número de telemóvel, código e nova palavra-passe obrigatórios' });
    }
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }
    const formatted = formatPhoneNumber(phoneNumber);
    if (!formatted) {
      return res.status(400).json({ error: 'Número de telemóvel inválido' });
    }
    
    const user = await prisma.user.findUnique({
      where: { phoneNumber: formatted },
      include: {
        passwordResetCodes: {
          where: {
            used: false,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    
    if (!user || user.passwordResetCodes.length === 0) {
      return res.status(401).json({ error: 'Código inválido ou expirado' });
    }
    
    const resetCode = user.passwordResetCodes[0];
    const codeMatch = await bcrypt.compare(code, resetCode.code);
    if (!codeMatch) {
      return res.status(401).json({ error: 'Código incorreto' });
    }
    
    // Marcar código como usado e atualizar password
    await prisma.$transaction([
      prisma.passwordResetCode.update({
        where: { id: resetCode.id },
        data: { used: true },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(newPassword, 10) },
      }),
    ]);
    
    res.json({ message: 'Palavra-passe alterada com sucesso' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao alterar palavra-passe' });
  }
});
