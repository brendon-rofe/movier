import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { LibraryService } from '../services/library.service';
import { MovieService, Movie } from '../services/movie.service';
import { TrackingService } from '../services/tracking.service';
import { NotificationService } from '../services/notification.service';
import { NotificationDropdown } from '../components/notification-dropdown/notification-dropdown';

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss'],
  imports: [IonContent, RouterLink, AsyncPipe, NotificationDropdown],
})
export class LibraryPage implements OnInit, OnDestroy {
  view: 'watchlist' | 'seen' = 'watchlist';
  libraryMovies = this.libraryService.library$;
  notifOpen = false;
  unreadCount = 0;
  private notifSub?: Subscription;

  constructor(
    public libraryService: LibraryService,
    private movieService: MovieService,
    private router: Router,
    public tracking: TrackingService,
    private notifService: NotificationService,
  ) {}

  ngOnInit() {
    this.notifSub = this.notifService.unreadCount$.subscribe((c) => this.unreadCount = c);
    this.libraryService.library$.subscribe((items) => {
      for (const item of items) {
        if (item.media_type === 'tv') {
          this.tracking.loadTvData(item.id);
        } else {
          this.tracking.loadMovieData(item.id);
        }
      }
    });
  }

  ngOnDestroy() {
    this.notifSub?.unsubscribe();
  }

  toggleNotifications() {
    this.notifOpen = !this.notifOpen;
  }

  closeNotifications() {
    this.notifOpen = false;
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
