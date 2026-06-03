import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from './movie.service';

interface LibraryItemResponse {
  id: number;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  releaseDate: string | null;
  mediaType: string;
  genreIds: string | null;
  createdAt: string;
  updatedAt: string;
}

function toMovie(item: LibraryItemResponse): Movie {
  return {
    id: item.tmdbId,
    title: item.title,
    overview: item.overview,
    poster_path: item.posterPath,
    backdrop_path: item.backdropPath,
    vote_average: item.voteAverage,
    release_date: item.releaseDate || '',
    genre_ids: item.genreIds ? JSON.parse(item.genreIds) : [],
    media_type: item.mediaType as 'movie' | 'tv',
  };
}

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private api = environment.apiBaseUrl;
  library = new BehaviorSubject<Movie[]>([]);
  library$: Observable<Movie[]> = this.library.asObservable();

  constructor(private http: HttpClient) {
    this.load();
  }

  private async load() {
    try {
      const items = await firstValueFrom(this.http.get<LibraryItemResponse[]>(`${this.api}/library`));
      this.library.next(items.map(toMovie));
    } catch {
      this.library.next([]);
    }
  }

  async addMovie(movie: Movie) {
    try {
      const body = {
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        voteAverage: movie.vote_average,
        releaseDate: movie.release_date || null,
        mediaType: movie.media_type || 'movie',
        genreIds: movie.genre_ids || [],
      };
      const item = await firstValueFrom(this.http.post<LibraryItemResponse>(`${this.api}/library`, body));
      const current = this.library.value;
      if (!current.some((m) => m.id === item.tmdbId)) {
        this.library.next([...current, toMovie(item)]);
      }
    } catch (err: any) {
      if (err.status !== 409) console.error('addMovie failed', err);
    }
  }

  async removeMovie(movieId: number) {
    try {
      const current = this.library.value;
      const movie = current.find((m) => m.id === movieId);
      const type = movie?.media_type || 'movie';
      await firstValueFrom(this.http.delete(`${this.api}/library/${movieId}`, { params: { type } }));
      this.library.next(current.filter((m) => m.id !== movieId));
    } catch (err) {
      console.error('removeMovie failed', err);
    }
  }

  isInLibrary(movieId: number): boolean {
    return this.library.value.some((m) => m.id === movieId);
  }
}
