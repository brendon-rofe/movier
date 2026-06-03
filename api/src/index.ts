import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import tmdbRoutes from './routes/tmdb.js';
import authRoutes from './routes/auth.js';
import libraryRoutes from './routes/library.js';
import trackingRoutes from './routes/tracking.js';
import linkRoutes from './routes/links.js';
import notificationRoutes from './routes/notifications.js';
import sharedWatchRoutes from './routes/shared-watches.js';

const app = express();
const port = process.env.PORT || 3100;

app.use(cors({
  origin: true,
  credentials: true,
}));
app.options('*', cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', tmdbRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/shared-watches', sharedWatchRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
