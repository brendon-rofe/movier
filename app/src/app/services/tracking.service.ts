import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export type MovieWatchStatus = 'want_to_watch' | 'watching' | 'watched' | 'dropped';

export interface MovieTrackData {
  status: MovieWatchStatus;
}

export interface EpisodeCheck {
  season: number;
  episode: number;
  watched: boolean;
}

export interface TvTrackData {
  episodes: EpisodeCheck[];
  totalEpisodes?: number;
}

interface TvTrackResponse {
  episodes: EpisodeCheck[];
  totalEpisodes: number;
}

interface TrackStore {
  [key: string]: MovieTrackData | TvTrackData;
}

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private api = environment.apiBaseUrl;
  private store = new BehaviorSubject<TrackStore>(this.load());
  store$: Observable<TrackStore> = this.store.asObservable();
  private tvCache = new Map<number, TvTrackData>();
  private movieCache = new Map<number, MovieTrackData>();

  constructor(private http: HttpClient) {}

  private key(id: number, type: 'movie' | 'tv'): string {
    return `${type}_${id}`;
  }

  private load(): TrackStore {
    try {
      return JSON.parse(localStorage.getItem('cineTrack_tracking') || '{}');
    } catch {
      return {};
    }
  }

  private save() {
    localStorage.setItem('cineTrack_tracking', JSON.stringify(this.store.value));
  }

  private async ensureTvCache(tvId: number) {
    if (this.tvCache.has(tvId)) return;
    await this.fetchTvData(tvId);
  }

  private async fetchTvData(tvId: number) {
    try {
      const data = await firstValueFrom(this.http.get<TvTrackResponse>(`${this.api}/tracking/tv/${tvId}/episodes`));
      this.tvCache.set(tvId, { episodes: data.episodes, totalEpisodes: data.totalEpisodes });
    } catch {
      this.tvCache.set(tvId, { episodes: [] });
    }
  }

  async loadTvData(tvId: number) {
    await this.fetchTvData(tvId);
  }

  async loadMovieData(movieId: number) {
    try {
      const data = await firstValueFrom(this.http.get<{ status: string | null }>(`${this.api}/tracking/movie/${movieId}`));
      if (data.status) {
        this.movieCache.set(movieId, { status: data.status as MovieWatchStatus });
      } else {
        this.movieCache.set(movieId, { status: 'want_to_watch' });
      }
    } catch {
      this.movieCache.set(movieId, { status: 'want_to_watch' });
    }
  }

  getMovieData(id: number): MovieTrackData | null {
    return this.movieCache.get(id) ?? null;
  }

  async setMovieStatus(id: number, status: MovieWatchStatus) {
    this.movieCache.set(id, { status });
    try {
      await firstValueFrom(this.http.put(`${this.api}/tracking/movie/${id}/status`, { status }));
    } catch {
      // fallback to localStorage
      const current = this.store.value;
      current[this.key(id, 'movie')] = { status };
      this.store.next({ ...current });
      this.save();
    }
  }

  getTvData(id: number): TvTrackData | null {
    return this.tvCache.get(id) ?? null;
  }

  async toggleEpisode(tvId: number, season: number, episode: number) {
    try {
      const data = await firstValueFrom(this.http.post<TvTrackResponse>(
        `${this.api}/tracking/tv/${tvId}/episodes/toggle`,
        { season, episode },
      ));
      this.tvCache.set(tvId, { episodes: data.episodes, totalEpisodes: data.totalEpisodes });
    } catch {
      await this.ensureTvCache(tvId);
    }
  }

  isEpisodeWatched(tvId: number, season: number, episode: number): boolean {
    const data = this.tvCache.get(tvId);
    if (!data) return false;
    const found = data.episodes.find((e) => e.season === season && e.episode === episode);
    return found?.watched ?? false;
  }

  getWatchedCount(tvId: number, season: number): number {
    const data = this.tvCache.get(tvId);
    if (!data) return 0;
    return data.episodes.filter((e) => e.season === season && e.watched).length;
  }

  async setTvTotalEpisodes(tvId: number, total: number) {
    try {
      await firstValueFrom(this.http.put(`${this.api}/tracking/tv/${tvId}/total-episodes`, { totalEpisodes: total }));
    } catch { /* ignore */ }
    await this.ensureTvCache(tvId);
    const cached = this.tvCache.get(tvId);
    if (cached) {
      cached.totalEpisodes = total;
    }
  }

  isTvFullyWatched(tvId: number): boolean {
    const data = this.tvCache.get(tvId);
    if (!data || !data.totalEpisodes) return false;
    const watchedCount = data.episodes.filter((e) => e.watched).length;
    return watchedCount >= data.totalEpisodes;
  }

  isSeasonFullyWatched(tvId: number, season: number, totalEpisodes: number): boolean {
    const data = this.tvCache.get(tvId);
    if (!data) return false;
    const seasonEps = data.episodes.filter((e) => e.season === season);
    if (seasonEps.length === 0) return false;
    return seasonEps.length === totalEpisodes && seasonEps.every((e) => e.watched);
  }

  async toggleSeason(tvId: number, season: number, totalEpisodes: number) {
    try {
      const data = await firstValueFrom(this.http.post<TvTrackResponse>(
        `${this.api}/tracking/tv/${tvId}/season/toggle`,
        { season, totalEpisodes },
      ));
      this.tvCache.set(tvId, { episodes: data.episodes, totalEpisodes: data.totalEpisodes });
    } catch {
      await this.ensureTvCache(tvId);
    }
  }
}
