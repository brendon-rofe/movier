import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const items = await prisma.libraryItem.findMany({ where: { userId: req.user!.userId } });
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { tmdbId, title, overview, posterPath, backdropPath, voteAverage, releaseDate, mediaType, genreIds } = req.body;
    const item = await prisma.libraryItem.create({
      data: {
        tmdbId,
        title,
        overview,
        posterPath,
        backdropPath,
        voteAverage: voteAverage ?? 0,
        releaseDate,
        mediaType: mediaType || 'movie',
        genreIds: genreIds ?? null,
        userId: req.user!.userId,
      },
    });
    res.status(201).json(item);
  } catch (e: any) {
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'Item already in library' });
    }
    next(e);
  }
});

router.get('/:tmdbId', async (req: AuthRequest, res, next) => {
  try {
    const mediaType = (req.query.type as string) || 'movie';
    const item = await prisma.libraryItem.findUnique({
      where: { userId_tmdbId_mediaType: { userId: req.user!.userId, tmdbId: Number(req.params.tmdbId), mediaType } },
    });
    res.json({ exists: !!item });
  } catch (e) { next(e); }
});

router.delete('/:tmdbId', async (req: AuthRequest, res, next) => {
  try {
    const mediaType = (req.query.type as string) || 'movie';
    await prisma.libraryItem.delete({
      where: { userId_tmdbId_mediaType: { userId: req.user!.userId, tmdbId: Number(req.params.tmdbId), mediaType } },
    });
    res.json({ ok: true });
  } catch (e: any) {
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Not found' });
    }
    next(e);
  }
});

export default router;
