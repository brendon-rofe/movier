import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { MovieService, Movie } from '../services/movie.service';
import { LibraryService } from '../services/library.service';
import { NotificationService } from '../services/notification.service';
import { NotificationDropdown } from '../components/notification-dropdown/notification-dropdown';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, RouterLink, NotificationDropdown],
})
export class HomePage implements OnInit, OnDestroy {
  view: 'series' | 'movies' = 'series';
  notifOpen = false;
  unreadCount = 0;
  private notifSub?: Subscription;

  constructor(
    private router: Router,
    private movieService: MovieService,
    public libraryService: LibraryService,
    private notifService: NotificationService,
  ) {}

  ngOnInit() {
    this.notifSub = this.notifService.unreadCount$.subscribe((c) => this.unreadCount = c);
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

  get watchingMovies(): Movie[] {
    return this.libraryService.library.value.filter(
      (m) => m.media_type !== 'tv',
    );
  }

  get watchingSeries(): Movie[] {
    return this.libraryService.library.value.filter(
      (m) => m.media_type === 'tv',
    );
  }

  getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path, 'w500');
  }

  openDetail(type: string, id: number) {
    this.router.navigate(['/track', type, id]);
  }

  toggleLibrary(movie: Movie) {
    if (this.libraryService.isInLibrary(movie.id)) {
      this.libraryService.removeMovie(movie.id);
    } else {
      this.libraryService.addMovie(movie);
    }
  }

  removeFromLibrary(id: number) {
    this.libraryService.removeMovie(id);
  }
}
