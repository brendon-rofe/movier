import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const userCount = await prisma.user.count();
    if (userCount >= 10) {
      return res.status(400).json({ error: 'Registration is full (maximum 10 users)' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, passwordHash } });

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, username: user.username } });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password, rememberMe } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const expiresIn = rememberMe ? '30d' : '7d';
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (e) { next(e); }
});

router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, username: true, createdAt: true, securityQuestion: true },
    });
    res.json({ user });
  } catch (e) { next(e); }
});

router.post('/get-security-question', async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.securityQuestion) {
      return res.status(404).json({ error: 'No security question set for this account' });
    }

    res.json({ securityQuestion: user.securityQuestion });
  } catch (e) { next(e); }
});

router.put('/security-question', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { securityQuestion, securityAnswer } = req.body;
    if (!securityQuestion || !securityAnswer) {
      return res.status(400).json({ error: 'Security question and answer required' });
    }

    const answerHash = await bcrypt.hash(securityAnswer.toLowerCase().trim(), 10);
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { securityQuestion, securityAnswer: answerHash },
    });

    res.json({ message: 'Security question set' });
  } catch (e) { next(e); }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { username, securityAnswer } = req.body;
    if (!username || !securityAnswer) {
      return res.status(400).json({ error: 'Username and security answer required' });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.securityAnswer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(securityAnswer.toLowerCase().trim(), user.securityAnswer);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid security answer' });
    }

    const resetToken = jwt.sign({ userId: user.id, purpose: 'password-reset' }, JWT_SECRET, { expiresIn: '15m' });
    res.json({ resetToken });
  } catch (e) { next(e); }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password required' });
    }

    let payload;
    try {
      payload = jwt.verify(resetToken, JWT_SECRET) as { userId: number; purpose: string };
    } catch {
      return res.status(401).json({ error: 'Invalid or expired reset token' });
    }

    if (payload.purpose !== 'password-reset') {
      return res.status(401).json({ error: 'Invalid reset token' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: payload.userId },
      data: { passwordHash },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (e) { next(e); }
});

export default router;
