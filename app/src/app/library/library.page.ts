import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { LibraryService } from '../services/library.service';
import { MovieService, Movie } from '../services/movie.service';
import { TrackingService } from '../services/tracking.service';

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss'],
  imports: [IonContent, RouterLink, AsyncPipe],
})
export class LibraryPage implements OnInit {
  view: 'watchlist' | 'seen' = 'watchlist';
  libraryMovies = this.libraryService.library$;

  constructor(
    public libraryService: LibraryService,
    private movieService: MovieService,
    private router: Router,
    public tracking: TrackingService,
  ) {}

  ngOnInit() {
    this.libraryService.library$.subscribe((items) => {
      for (const item of items) {
        if (item.media_type === 'tv') {
          this.tracking.loadTvData(item.id);
        }
      }
    });
  }

  get filteredMovies(): Movie[] {
    return this.libraryService.library.value.filter((m) => {
      if (m.media_type === 'tv') {
        const isFullyWatched = this.tracking.isTvFullyWatched(m.id);
        return this.view === 'seen' ? isFullyWatched : !isFullyWatched;
      }
      const data = this.tracking.getMovieData(m.id);
      const isWatched = data?.status === 'watched';
      return this.view === 'seen' ? isWatched : !isWatched;
    });
  }

  getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path, 'w500');
  }

  openTracking(movie: Movie) {
    const type = movie.media_type || 'movie';
    this.router.navigate(['/track', type, movie.id]);
  }

  removeFromLibrary(movie: Movie) {
    this.libraryService.removeMovie(movie.id);
  }
}
