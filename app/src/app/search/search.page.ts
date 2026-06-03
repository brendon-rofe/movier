import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { Subject, debounceTime, distinctUntilChanged, switchMap, Subscription } from 'rxjs';
import { MovieService, SearchResultItem } from '../services/movie.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  imports: [IonContent, RouterLink, FormsModule],
})
export class SearchPage implements OnInit, OnDestroy {
  query = '';
  results: SearchResultItem[] = [];
  loading = false;

  private searchSubject = new Subject<string>();
  private sub: Subscription | null = null;

  constructor(
    private movieService: MovieService,
    private router: Router,
  ) {}

  ngOnInit() {
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
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
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
}
