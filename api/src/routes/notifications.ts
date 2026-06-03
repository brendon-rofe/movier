import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: [{ read: 'asc' }, { createdAt: 'desc' }],
      include: { fromUser: { select: { id: true, username: true } } },
    });
    res.json({ notifications });
  } catch (e) { next(e); }
});

router.get('/unread-count', async (req: AuthRequest, res, next) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user!.userId, read: false },
    });
    res.json({ count });
  } catch (e) { next(e); }
});

router.post('/:id/read', async (req: AuthRequest, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { id: Number(req.params.id), userId: req.user!.userId },
      data: { read: true },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.post('/read-all', async (req: AuthRequest, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, read: false },
      data: { read: true },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.delete('/', async (req: AuthRequest, res, next) => {
  try {
    await prisma.notification.deleteMany({
      where: { userId: req.user!.userId },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
