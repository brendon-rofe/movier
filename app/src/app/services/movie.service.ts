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
  media_type?: 'movie' | 'tv';
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
  seasons: TvSeason[];
}

export interface SearchResultItem {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

export interface TvSeason {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  overview: string;
  poster_path: string | null;
}

export interface TvEpisode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  vote_average: number;
}

export interface SeasonDetails {
  id: number;
  season_number: number;
  episodes: TvEpisode[];
  name: string;
  overview: string;
}

interface TMDBMovieResponse {
  results: Movie[];
}

interface TMDBTvResponse {
  results: TvShow[];
}

interface TMDBMultiSearchResponse {
  results: SearchResultItem[];
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

  getSeasonDetails(tvId: number, seasonNumber: number): Observable<SeasonDetails> {
    return this.http.get<SeasonDetails>(`${this.baseUrl}/tv/${tvId}/season/${seasonNumber}`, {
      params: { api_key: this.apiKey },
    });
  }

  searchMulti(query: string, page: number = 1): Observable<SearchResultItem[]> {
    return this.http
      .get<TMDBMultiSearchResponse>(`${this.baseUrl}/search/multi`, {
        params: { api_key: this.apiKey, query, page: page.toString() },
      })
      .pipe(map((res) => res.results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv')));
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '';
    return `${this.imageBase}/${size}${path}`;
  }
}
