import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const items = await prisma.libraryItem.findMany();
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
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
        genreIds: genreIds ? JSON.stringify(genreIds) : null,
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

router.get('/:tmdbId', async (req, res, next) => {
  try {
    const mediaType = (req.query.type as string) || 'movie';
    const item = await prisma.libraryItem.findUnique({
      where: { tmdbId_mediaType: { tmdbId: Number(req.params.tmdbId), mediaType } },
    });
    res.json({ exists: !!item });
  } catch (e) { next(e); }
});

router.delete('/:tmdbId', async (req, res, next) => {
  try {
    const mediaType = (req.query.type as string) || 'movie';
    await prisma.libraryItem.delete({
      where: { tmdbId_mediaType: { tmdbId: Number(req.params.tmdbId), mediaType } },
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
