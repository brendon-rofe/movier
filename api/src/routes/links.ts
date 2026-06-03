import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.post('/invite', async (req: AuthRequest, res, next) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });
    if (username === req.user!.username) return res.status(400).json({ error: 'Cannot invite yourself' });

    const receiver = await prisma.user.findUnique({ where: { username } });
    if (!receiver) return res.status(404).json({ error: 'User not found' });

    const existing = await prisma.userLink.findFirst({
      where: {
        OR: [
          { requesterId: req.user!.userId, receiverId: receiver.id },
          { requesterId: receiver.id, receiverId: req.user!.userId },
        ],
      },
    });
    if (existing) {
      if (existing.status === 'accepted') return res.status(409).json({ error: 'Already linked' });
      return res.status(409).json({ error: 'Invite already sent' });
    }

    const link = await prisma.userLink.create({
      data: { requesterId: req.user!.userId, receiverId: receiver.id, status: 'pending' },
    });

    await prisma.notification.create({
      data: {
        userId: receiver.id,
        type: 'invite_received',
        fromUserId: req.user!.userId,
        message: `${req.user!.username} wants to link with you`,
        linkId: link.id,
      },
    });

    res.status(201).json({ link });
  } catch (e) { next(e); }
});

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const sent = await prisma.userLink.findMany({
      where: { requesterId: req.user!.userId },
      include: { receiver: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const received = await prisma.userLink.findMany({
      where: { receiverId: req.user!.userId },
      include: { requester: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ sent, received });
  } catch (e) { next(e); }
});

router.post('/:id/accept', async (req: AuthRequest, res, next) => {
  try {
    const link = await prisma.userLink.findUnique({ where: { id: Number(req.params.id) } });
    if (!link || link.receiverId !== req.user!.userId) return res.status(404).json({ error: 'Link not found' });
    if (link.status !== 'pending') return res.status(400).json({ error: 'Link is not pending' });

    const updated = await prisma.userLink.update({
      where: { id: link.id },
      data: { status: 'accepted' },
    });

    const requester = await prisma.user.findUnique({ where: { id: link.requesterId } });

    await prisma.notification.create({
      data: {
        userId: link.requesterId,
        type: 'invite_accepted',
        fromUserId: req.user!.userId,
        message: `${req.user!.username} accepted your link request`,
        linkId: link.id,
      },
    });

    res.json({ link: updated });
  } catch (e) { next(e); }
});

router.post('/:id/reject', async (req: AuthRequest, res, next) => {
  try {
    const link = await prisma.userLink.findUnique({ where: { id: Number(req.params.id) } });
    if (!link || link.receiverId !== req.user!.userId) return res.status(404).json({ error: 'Link not found' });

    await prisma.userLink.delete({ where: { id: link.id } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const link = await prisma.userLink.findUnique({ where: { id: Number(req.params.id) } });
    if (!link) return res.status(404).json({ error: 'Link not found' });
    if (link.requesterId !== req.user!.userId && link.receiverId !== req.user!.userId) {
      return res.status(403).json({ error: 'Not your link' });
    }
    await prisma.userLink.delete({ where: { id: link.id } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
