import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

async function ensureTvTrack(userId: number, tmdbId: number) {
  const item = await prisma.libraryItem.findUnique({
    where: { userId_tmdbId_mediaType: { userId, tmdbId, mediaType: 'tv' } },
  });
  if (!item) return null;

  let track = await prisma.tvTrack.findUnique({ where: { libraryItemId: item.id } });
  if (!track) {
    track = await prisma.tvTrack.create({ data: { libraryItemId: item.id } });
  }
  return { item, track };
}

router.get('/tv/:tmdbId/episodes', async (req: AuthRequest, res, next) => {
  try {
    const result = await ensureTvTrack(req.user!.userId, Number(req.params.tmdbId));
    if (!result) return res.json({ episodes: [], totalEpisodes: 0 });

    const episodes = await prisma.tvEpisode.findMany({ where: { tvTrackId: result.track.id } });
    res.json({
      episodes: episodes.map((e) => ({ season: e.seasonNumber, episode: e.episodeNumber, watched: e.watched })),
      totalEpisodes: result.track.totalEpisodes,
    });
  } catch (e) { next(e); }
});

router.post('/tv/:tmdbId/episodes/toggle', async (req: AuthRequest, res, next) => {
  try {
    const result = await ensureTvTrack(req.user!.userId, Number(req.params.tmdbId));
    if (!result) return res.status(404).json({ error: 'TV show not in library' });

    const { season, episode } = req.body;
    const existing = await prisma.tvEpisode.findUnique({
      where: { tvTrackId_seasonNumber_episodeNumber: { tvTrackId: result.track.id, seasonNumber: season, episodeNumber: episode } },
    });

    if (existing) {
      await prisma.tvEpisode.update({
        where: { id: existing.id },
        data: { watched: !existing.watched },
      });
    } else {
      await prisma.tvEpisode.create({
        data: { tvTrackId: result.track.id, seasonNumber: season, episodeNumber: episode, watched: true },
      });
    }

    const episodes = await prisma.tvEpisode.findMany({ where: { tvTrackId: result.track.id } });
    res.json({
      episodes: episodes.map((e) => ({ season: e.seasonNumber, episode: e.episodeNumber, watched: e.watched })),
      totalEpisodes: result.track.totalEpisodes,
    });
  } catch (e) { next(e); }
});

router.post('/tv/:tmdbId/season/toggle', async (req: AuthRequest, res, next) => {
  try {
    const result = await ensureTvTrack(req.user!.userId, Number(req.params.tmdbId));
    if (!result) return res.status(404).json({ error: 'TV show not in library' });

    const { season, totalEpisodes } = req.body;
    const existing = await prisma.tvEpisode.findMany({
      where: { tvTrackId: result.track.id, seasonNumber: season },
    });

    const allWatched = existing.length === totalEpisodes && existing.every((e) => e.watched);
    const newWatched = !allWatched;

    for (let ep = 1; ep <= totalEpisodes; ep++) {
      const found = existing.find((e) => e.episodeNumber === ep);
      if (found) {
        await prisma.tvEpisode.update({ where: { id: found.id }, data: { watched: newWatched } });
      } else {
        await prisma.tvEpisode.create({
          data: { tvTrackId: result.track.id, seasonNumber: season, episodeNumber: ep, watched: newWatched },
        });
      }
    }

    const episodes = await prisma.tvEpisode.findMany({ where: { tvTrackId: result.track.id } });
    res.json({
      episodes: episodes.map((e) => ({ season: e.seasonNumber, episode: e.episodeNumber, watched: e.watched })),
      totalEpisodes: result.track.totalEpisodes,
    });
  } catch (e) { next(e); }
});

router.put('/tv/:tmdbId/total-episodes', async (req: AuthRequest, res, next) => {
  try {
    const result = await ensureTvTrack(req.user!.userId, Number(req.params.tmdbId));
    if (!result) return res.status(404).json({ error: 'TV show not in library' });

    await prisma.tvTrack.update({
      where: { id: result.track.id },
      data: { totalEpisodes: req.body.totalEpisodes },
    });

    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
