import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { LibraryService } from '../services/library.service';
import { MovieService, Movie } from '../services/movie.service';

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss'],
  imports: [IonContent, RouterLink, AsyncPipe],
})
export class LibraryPage {
  profileImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrTkgyMaeChRKiU67Fi9BPdrK9AycjjEzVRdLraTnQ0P9qEpcXeeMyFUJGsQtKEPgzkkrcE0CdnlA3G_1usIUNHd-I9srVquhMw-EDqhV_IURg5XpaeyUgiGsDNS2XDGiAmnyWIlZ3-EYPUTQlmRAhBNnpO9r2binK9mTcrwoBn2NLDydNudnRga1rgdEf1SuLSj-WMsESOU5YqH0c4y1vjujBmkBd9eYJLbhITnk68jLH_Rxq6EJ9Q2bG2CYCdwtORMYnyWJGg_E';

  libraryMovies = this.libraryService.library$;

  constructor(
    public libraryService: LibraryService,
    private movieService: MovieService,
    private router: Router,
  ) {}

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
