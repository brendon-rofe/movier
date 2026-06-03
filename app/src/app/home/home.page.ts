import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MovieService, Movie } from '../services/movie.service';
import { LibraryService } from '../services/library.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, RouterLink],
})
export class HomePage {
  view: 'series' | 'movies' = 'series';

  constructor(
    private router: Router,
    private movieService: MovieService,
    public libraryService: LibraryService,
  ) {}

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
    this.router.navigate(['/detail', type, id]);
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
