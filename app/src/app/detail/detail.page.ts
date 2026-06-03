import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { MovieService, MovieDetails, TvDetails, Movie, Genre } from '../services/movie.service';
import { LibraryService } from '../services/library.service';
import { SharedWatchService } from '../services/shared-watch.service';
import { LinkService, UserLink } from '../services/link.service';
import { WatchInviteModal } from '../components/watch-invite-modal/watch-invite-modal';

@Component({
  selector: 'app-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss'],
  imports: [IonContent, FormsModule, WatchInviteModal],
})
export class DetailPage implements OnInit {
  movie: MovieDetails | null = null;
  tvShow: TvDetails | null = null;
  type: 'movie' | 'tv' = 'movie';
  showWatchInvite = false;
  linkedUsers: UserLink[] = [];
  pendingMovie: Movie | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    public libraryService: LibraryService,
    private sharedWatchService: SharedWatchService,
    private linkService: LinkService,
  ) {}

  async ngOnInit() {
    this.type = (this.route.snapshot.paramMap.get('type') as 'movie' | 'tv') || 'movie';
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.type === 'movie') {
      this.movieService.getMovieDetails(id).subscribe((data) => {
        this.movie = data;
      });
    } else {
      this.movieService.getTvDetails(id).subscribe((data) => {
        this.tvShow = data;
      });
    }

    await this.linkService.loadLinks();
    this.linkService.links$.subscribe((links) => {
      this.linkedUsers = [...links.sent, ...links.received].filter((l) => l.status === 'accepted');
    });
  }

  getTitle(): string {
    if (this.type === 'movie' && this.movie) return this.movie.title;
    if (this.type === 'tv' && this.tvShow) return this.tvShow.name;
    return '';
  }

  getOverview(): string {
    if (this.movie) return this.movie.overview;
    if (this.tvShow) return this.tvShow.overview;
    return '';
  }

  getPosterPath(): string | null {
    if (this.movie) return this.movie.poster_path;
    if (this.tvShow) return this.tvShow.poster_path;
    return null;
  }

  getBackdropPath(): string | null {
    if (this.movie) return this.movie.backdrop_path;
    if (this.tvShow) return this.tvShow.backdrop_path;
    return null;
  }

  getGenres(): Genre[] {
    if (this.movie) return this.movie.genres;
    if (this.tvShow) return this.tvShow.genres;
    return [];
  }

  getReleaseYear(): string {
    if (this.movie) return this.movie.release_date?.substring(0, 4) || '';
    if (this.tvShow) return this.tvShow.first_air_date?.substring(0, 4) || '';
    return '';
  }

  getRating(): number {
    if (this.movie) return this.movie.vote_average;
    if (this.tvShow) return this.tvShow.vote_average;
    return 0;
  }

  getRuntime(): string {
    if (this.movie && this.movie.runtime) return `${this.movie.runtime} min`;
    if (this.tvShow && this.tvShow.runtime?.length) return `${this.tvShow.runtime[0]} min`;
    return '';
  }

  getTagline(): string | null {
    if (this.movie) return this.movie.tagline;
    if (this.tvShow) return this.tvShow.tagline;
    return null;
  }

  getCurrentId(): number {
    if (this.type === 'movie') return this.movie?.id ?? 0;
    return this.tvShow?.id ?? 0;
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    return this.movieService.getImageUrl(path, size);
  }

  async toggleLibrary() {
    const id = this.type === 'movie' ? this.movie?.id : this.tvShow?.id;
    const title = this.getTitle();
    const overview = this.getOverview();
    const posterPath = this.getPosterPath();
    const backdropPath = this.getBackdropPath();
    const voteAverage = this.getRating();
    const releaseDate = this.type === 'movie' ? this.movie?.release_date || '' : this.tvShow?.first_air_date || '';
    const genreIds = this.getGenres().map((g) => g.id);

    if (!id) return;

    if (this.libraryService.isInLibrary(id)) {
      this.libraryService.removeMovie(id);
      return;
    }

    this.pendingMovie = {
      id,
      title,
      overview,
      poster_path: posterPath,
      backdrop_path: backdropPath,
      vote_average: voteAverage,
      release_date: releaseDate,
      genre_ids: genreIds,
      media_type: this.type,
    };

    if (this.linkedUsers.length > 0) {
      this.showWatchInvite = true;
    } else {
      await this.libraryService.addMovie(this.pendingMovie);
      this.pendingMovie = null;
    }
  }

  onInviteSent() {
    if (this.pendingMovie) {
      this.libraryService.addMovie(this.pendingMovie);
      this.pendingMovie = null;
    }
  }

  onInviteDismiss() {
    this.pendingMovie = null;
  }

  goBack() {
    window.history.back();
  }
}
