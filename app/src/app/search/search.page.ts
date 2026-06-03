import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { Subject, debounceTime, distinctUntilChanged, switchMap, Subscription } from 'rxjs';
import { MovieService, SearchResultItem, Movie } from '../services/movie.service';
import { LibraryService } from '../services/library.service';
import { NotificationService } from '../services/notification.service';
import { LinkService, UserLink } from '../services/link.service';
import { NotificationDropdown } from '../components/notification-dropdown/notification-dropdown';
import { WatchInviteModal } from '../components/watch-invite-modal/watch-invite-modal';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  imports: [IonContent, RouterLink, FormsModule, NotificationDropdown, WatchInviteModal],
})
export class SearchPage implements OnInit, OnDestroy {
  query = '';
  results: SearchResultItem[] = [];
  loading = false;
  notifOpen = false;
  unreadCount = 0;
  showWatchInvite = false;
  linkedUsers: UserLink[] = [];
  lastAddedItem: SearchResultItem | null = null;
  pendingMovie: Movie | null = null;

  private searchSubject = new Subject<string>();
  private sub: Subscription | null = null;
  private notifSub?: Subscription;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private notifService: NotificationService,
    public libraryService: LibraryService,
    private linkService: LinkService,
  ) {}

  async ngOnInit() {
    this.notifSub = this.notifService.unreadCount$.subscribe((c) => this.unreadCount = c);
    this.sub = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((q) => {
        if (!q.trim()) {
          this.results = [];
          this.loading = false;
          return [];
        }
        this.loading = true;
        return this.movieService.searchMulti(q);
      }),
    ).subscribe((items) => {
      this.results = items;
      this.loading = false;
    });

    await this.linkService.loadLinks();
    this.linkService.links$.subscribe((links) => {
      this.linkedUsers = [...links.sent, ...links.received].filter((l) => l.status === 'accepted');
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.notifSub?.unsubscribe();
  }

  toggleNotifications() {
    this.notifOpen = !this.notifOpen;
  }

  closeNotifications() {
    this.notifOpen = false;
  }

  onQueryChange(value: string) {
    this.query = value;
    this.searchSubject.next(value);
  }

  clearQuery() {
    this.query = '';
    this.results = [];
  }

  openDetail(item: SearchResultItem) {
    this.router.navigate(['/detail', item.media_type, item.id]);
  }

  getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path, 'w500');
  }

  getDisplayTitle(item: SearchResultItem): string {
    return item.title || item.name || '';
  }

  getDisplayYear(item: SearchResultItem): string {
    const date = item.release_date || item.first_air_date || '';
    return date.substring(0, 4);
  }

  async toggleLibrary(item: SearchResultItem, event: Event) {
    event.stopPropagation();
    const id = item.id;
    if (this.libraryService.isInLibrary(id)) {
      this.libraryService.removeMovie(id);
      return;
    }

    this.pendingMovie = {
      id,
      title: item.title || item.name || '',
      overview: item.overview || '',
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
      release_date: item.release_date || item.first_air_date || '',
      genre_ids: item.genre_ids || [],
      media_type: item.media_type,
    };

    if (this.linkedUsers.length > 0) {
      this.lastAddedItem = item;
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
    this.lastAddedItem = null;
  }

  onInviteDismiss() {
    this.pendingMovie = null;
    this.lastAddedItem = null;
  }
}
