import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.post('/invite', async (req: AuthRequest, res, next) => {
  try {
    const { username, tmdbId, mediaType, title } = req.body;
    if (!username || !tmdbId || !mediaType || !title) {
      return res.status(400).json({ error: 'username, tmdbId, mediaType, title required' });
    }

    const partner = await prisma.user.findUnique({ where: { username } });
    if (!partner) return res.status(404).json({ error: 'User not found' });
    if (partner.id === req.user!.userId) return res.status(400).json({ error: 'Cannot invite yourself' });

    const link = await prisma.userLink.findFirst({
      where: {
        status: 'accepted',
        OR: [
          { requesterId: req.user!.userId, receiverId: partner.id },
          { requesterId: partner.id, receiverId: req.user!.userId },
        ],
      },
    });
    if (!link) return res.status(400).json({ error: 'Not linked with this user' });

    const existing = await prisma.sharedWatch.findUnique({
      where: { tmdbId_mediaType_ownerId_partnerId: { tmdbId, mediaType, ownerId: req.user!.userId, partnerId: partner.id } },
    });
    if (existing) return res.status(409).json({ error: 'Already shared or invited' });

    const sw = await prisma.sharedWatch.create({
      data: { tmdbId, mediaType, title, ownerId: req.user!.userId, partnerId: partner.id },
    });

    await prisma.notification.create({
      data: {
        userId: partner.id,
        type: 'watch_invite',
        fromUserId: req.user!.userId,
        message: `${req.user!.username} invited you to watch ${title} together`,
        sharedWatchId: sw.id,
      },
    });

    res.status(201).json({ sharedWatch: sw });
  } catch (e) { next(e); }
});

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const owned = await prisma.sharedWatch.findMany({
      where: { ownerId: req.user!.userId },
      include: { partner: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const partnered = await prisma.sharedWatch.findMany({
      where: { partnerId: req.user!.userId },
      include: { owner: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ owned, partnered });
  } catch (e) { next(e); }
});

router.post('/:id/accept', async (req: AuthRequest, res, next) => {
  try {
    const sw = await prisma.sharedWatch.findUnique({ where: { id: Number(req.params.id) } });
    if (!sw || sw.partnerId !== req.user!.userId) return res.status(404).json({ error: 'Not found' });
    if (sw.status !== 'pending') return res.status(400).json({ error: 'Not pending' });

    const updated = await prisma.sharedWatch.update({ where: { id: sw.id }, data: { status: 'accepted' } });

    // Add to partner's library if not already there
    const existingItem = await prisma.libraryItem.findUnique({
      where: { userId_tmdbId_mediaType: { userId: req.user!.userId, tmdbId: sw.tmdbId, mediaType: sw.mediaType } },
    });

    if (!existingItem) {
      const ownerItem = await prisma.libraryItem.findFirst({
        where: { userId: sw.ownerId, tmdbId: sw.tmdbId, mediaType: sw.mediaType },
      });

      if (ownerItem) {
        await prisma.libraryItem.create({
          data: {
            userId: req.user!.userId,
            tmdbId: sw.tmdbId,
            title: ownerItem.title,
            overview: ownerItem.overview,
            posterPath: ownerItem.posterPath,
            backdropPath: ownerItem.backdropPath,
            voteAverage: ownerItem.voteAverage,
            releaseDate: ownerItem.releaseDate,
            mediaType: sw.mediaType,
            genreIds: ownerItem.genreIds,
          },
        });
      }
    }

    await prisma.notification.create({
      data: {
        userId: sw.ownerId,
        type: 'watch_accepted',
        fromUserId: req.user!.userId,
        message: `${req.user!.username} accepted your invite to watch ${sw.title} together`,
        sharedWatchId: sw.id,
      },
    });

    res.json({ sharedWatch: updated });
  } catch (e) { next(e); }
});

router.post('/:id/decline', async (req: AuthRequest, res, next) => {
  try {
    const sw = await prisma.sharedWatch.findUnique({ where: { id: Number(req.params.id) } });
    if (!sw || sw.partnerId !== req.user!.userId) return res.status(404).json({ error: 'Not found' });
    await prisma.sharedWatch.delete({ where: { id: sw.id } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const sw = await prisma.sharedWatch.findUnique({ where: { id: Number(req.params.id) } });
    if (!sw) return res.status(404).json({ error: 'Not found' });
    if (sw.ownerId !== req.user!.userId && sw.partnerId !== req.user!.userId) {
      return res.status(403).json({ error: 'Not your watch' });
    }
    await prisma.sharedWatch.delete({ where: { id: sw.id } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
