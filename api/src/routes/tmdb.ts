import { Router } from 'express';
import { fetchTmdb } from '../tmdb.js';

const router = Router();

router.get('/movies/popular', async (req, res, next) => {
  try {
    const page = (req.query.page as string) || '1';
    const data = await fetchTmdb<{ results: unknown[] }>('/movie/popular', { page });
    res.json(data.results);
  } catch (e) { next(e); }
});

router.get('/tv/popular', async (req, res, next) => {
  try {
    const page = (req.query.page as string) || '1';
    const data = await fetchTmdb<{ results: unknown[] }>('/tv/popular', { page });
    res.json(data.results);
  } catch (e) { next(e); }
});

router.get('/movie/:id', async (req, res, next) => {
  try {
    const data = await fetchTmdb(`/movie/${req.params.id}`);
    res.json(data);
  } catch (e) { next(e); }
});

router.get('/tv/:id', async (req, res, next) => {
  try {
    const data = await fetchTmdb(`/tv/${req.params.id}`);
    res.json(data);
  } catch (e) { next(e); }
});

router.get('/tv/:id/season/:season', async (req, res, next) => {
  try {
    const data = await fetchTmdb(`/tv/${req.params.id}/season/${req.params.season}`);
    res.json(data);
  } catch (e) { next(e); }
});

router.get('/tv/:id/season/:season/episode/:episode', async (req, res, next) => {
  try {
    const data = await fetchTmdb(`/tv/${req.params.id}/season/${req.params.season}/episode/${req.params.episode}`);
    res.json(data);
  } catch (e) { next(e); }
});

router.get('/search/multi', async (req, res, next) => {
  try {
    const query = (req.query.query as string) || '';
    const page = (req.query.page as string) || '1';
    const data = await fetchTmdb<{ results: unknown[] }>('/search/multi', { query, page });
    res.json(data.results);
  } catch (e) { next(e); }
});

export default router;
