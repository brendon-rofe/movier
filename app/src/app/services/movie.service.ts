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

export interface TvShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  tagline: string | null;
  genres: Genre[];
  budget: number;
  revenue: number;
  status: string;
  homepage: string | null;
}

export interface TvDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  runtime: number[];
  tagline: string | null;
  genres: Genre[];
  status: string;
  homepage: string | null;
  number_of_seasons: number;
  number_of_episodes: number;
}

interface TMDBMovieResponse {
  results: Movie[];
}

interface TMDBTvResponse {
  results: TvShow[];
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private baseUrl = environment.tmdbBaseUrl;
  private apiKey = environment.tmdbApiKey;
  private imageBase = environment.tmdbImageBaseUrl;

  constructor(private http: HttpClient) {}

  getPopularMovies(page: number = 1): Observable<Movie[]> {
    return this.http
      .get<TMDBMovieResponse>(`${this.baseUrl}/movie/popular`, {
        params: { api_key: this.apiKey, page: page.toString() },
      })
      .pipe(map((res) => res.results));
  }

  getPopularTvShows(page: number = 1): Observable<TvShow[]> {
    return this.http
      .get<TMDBTvResponse>(`${this.baseUrl}/tv/popular`, {
        params: { api_key: this.apiKey, page: page.toString() },
      })
      .pipe(map((res) => res.results));
  }

  getMovieDetails(id: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${id}`, {
      params: { api_key: this.apiKey },
    });
  }

  getTvDetails(id: number): Observable<TvDetails> {
    return this.http.get<TvDetails>(`${this.baseUrl}/tv/${id}`, {
      params: { api_key: this.apiKey },
    });
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '';
    return `${this.imageBase}/${size}${path}`;
  }
}
