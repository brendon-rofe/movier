import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

interface TrackStore {
  [key: string]: MovieTrackData | TvTrackData;
}

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private store = new BehaviorSubject<TrackStore>(this.load());
  store$: Observable<TrackStore> = this.store.asObservable();

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

  getMovieData(id: number): MovieTrackData | null {
    const data = this.store.value[this.key(id, 'movie')];
    return data && 'status' in data ? (data as MovieTrackData) : null;
  }

  setMovieStatus(id: number, status: MovieWatchStatus) {
    const current = this.store.value;
    current[this.key(id, 'movie')] = { status };
    this.store.next({ ...current });
    this.save();
  }

  getTvData(id: number): TvTrackData | null {
    const data = this.store.value[this.key(id, 'tv')];
    return data && 'episodes' in data ? (data as TvTrackData) : null;
  }

  toggleEpisode(tvId: number, season: number, episode: number) {
    const current = { ...this.store.value };
    const key = this.key(tvId, 'tv');
    let data = current[key] as TvTrackData | undefined;
    if (!data) {
      data = { episodes: [] };
    }
    const existing = data.episodes.find((e) => e.season === season && e.episode === episode);
    if (existing) {
      existing.watched = !existing.watched;
    } else {
      data.episodes.push({ season, episode, watched: true });
    }
    current[key] = data;
    this.store.next(current);
    this.save();
  }

  isEpisodeWatched(tvId: number, season: number, episode: number): boolean {
    const data = this.getTvData(tvId);
    if (!data) return false;
    const found = data.episodes.find((e) => e.season === season && e.episode === episode);
    return found?.watched ?? false;
  }

  getWatchedCount(tvId: number, season: number): number {
    const data = this.getTvData(tvId);
    if (!data) return 0;
    return data.episodes.filter((e) => e.season === season && e.watched).length;
  }

  setTvTotalEpisodes(tvId: number, total: number) {
    const current = { ...this.store.value };
    const key = this.key(tvId, 'tv');
    let data = current[key] as TvTrackData | undefined;
    if (!data) {
      data = { episodes: [] };
    }
    data.totalEpisodes = total;
    current[key] = data;
    this.store.next(current);
    this.save();
  }

  isTvFullyWatched(tvId: number): boolean {
    const data = this.getTvData(tvId);
    if (!data || !data.totalEpisodes) return false;
    const watchedCount = data.episodes.filter((e) => e.watched).length;
    return watchedCount >= data.totalEpisodes;
  }

  isSeasonFullyWatched(tvId: number, season: number, totalEpisodes: number): boolean {
    const data = this.getTvData(tvId);
    if (!data) return false;
    const seasonEps = data.episodes.filter((e) => e.season === season);
    if (seasonEps.length === 0) return false;
    return seasonEps.length === totalEpisodes && seasonEps.every((e) => e.watched);
  }

  toggleSeason(tvId: number, season: number, totalEpisodes: number) {
    const current = { ...this.store.value };
    const key = this.key(tvId, 'tv');
    let data = current[key] as TvTrackData | undefined;
    if (!data) {
      data = { episodes: [] };
    }

    const allWatched = this.isSeasonFullyWatched(tvId, season, totalEpisodes);

    for (let ep = 1; ep <= totalEpisodes; ep++) {
      const existing = data.episodes.find((e) => e.season === season && e.episode === ep);
      if (existing) {
        existing.watched = !allWatched;
      } else {
        data.episodes.push({ season, episode: ep, watched: !allWatched });
      }
    }

    current[key] = data;
    this.store.next(current);
    this.save();
  }
}
