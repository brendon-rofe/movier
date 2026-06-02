import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

interface TMDBResponse {
  results: Movie[];
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private baseUrl = environment.tmdbBaseUrl;
  private apiKey = environment.tmdbApiKey;
  private imageBase = environment.tmdbImageBaseUrl;

  constructor(private http: HttpClient) {}

  getPopularMovies(page: number = 1): Observable<Movie[]> {
    return this.http
      .get<TMDBResponse>(`${this.baseUrl}/movie/popular`, {
        params: { api_key: this.apiKey, page: page.toString() },
      })
      .pipe(map((res) => res.results));
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '';
    return `${this.imageBase}/${size}${path}`;
  }
}
