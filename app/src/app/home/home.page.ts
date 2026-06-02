import { Component, OnInit } from '@angular/core';
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
export class HomePage implements OnInit {
  popularMovies: Movie[] = [];
  profileImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4YV5ni1aKb4BqdMdcucLHbKZy_ZYbTt67rWT2Cc_BdCRMUn-sbw1t_FWDrR4q6H87ir5CwIu-FZ4-htLBswHRwwwLphQJo4vIReCmkNAP_qgX56_M9otTW7uga_mub84fDbDQcBj7ULcdYenGX4aj9frRDfS3uid7p3St1FsozDHLpdGnfkkcYXUfKTfy8UjYBruezKaEuh7sLIQU5_iIGW4Z89YdYRTIWsZwuAfHfccJABnC8kIICwnjxXkgCPWC_8jUpZaNb-M';

  constructor(
    private router: Router,
    private movieService: MovieService,
    public libraryService: LibraryService,
  ) {}

  ngOnInit() {
    this.movieService.getPopularMovies().subscribe((movies) => {
      this.popularMovies = movies.slice(0, 6);
    });
  }

  getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path, 'w500');
  }

  openDetail(movieId: number) {
    this.router.navigate(['/detail', movieId]);
  }

  toggleLibrary(movie: Movie) {
    if (this.libraryService.isInLibrary(movie.id)) {
      this.libraryService.removeMovie(movie.id);
    } else {
      this.libraryService.addMovie(movie);
    }
  }
}
