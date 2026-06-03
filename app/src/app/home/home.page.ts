import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MovieService, Movie, TvShow } from '../services/movie.service';
import { LibraryService } from '../services/library.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, RouterLink],
})
export class HomePage implements OnInit {
  popularMovies: Movie[] = [];
  popularTvShows: TvShow[] = [];
  profileImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4YV5ni1aKb4BqdMdcucLHbKZy_ZYbTt67rWT2Cc_BdCRMUn-sbw1t_FWDrR4q6H87ir5CwIu-FZ4-htLBswHRwwwLphQJo4vIReCmkNAP_qgX56_M9otTW7uga_mub84fDbDQcBj7ULcdYenGX4aj9frRDfS3uid7p3St1FsozDHLpdGnfkkcYXUfKTfy8UjYBruezKaEuh7sLIQU5_iIGW4Z89YdYRTIWsZwuAfHfccJABnC8kIICwnjxXkgCPWC_8jUpZaNb-M';

  constructor(
    private router: Router,
    private movieService: MovieService,
    public libraryService: LibraryService,
  ) {}

  ngOnInit() {
    this.movieService.getPopularMovies().subscribe((movies) => {
      this.popularMovies = movies.slice(0, 3);
    });
    this.movieService.getPopularTvShows().subscribe((shows) => {
      this.popularTvShows = shows.slice(0, 3);
    });
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

  addTvToLibrary(show: TvShow) {
    const movie: Movie = {
      id: show.id,
      title: show.name,
      overview: show.overview,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      vote_average: show.vote_average,
      release_date: show.first_air_date,
      genre_ids: show.genre_ids,
      media_type: 'tv',
    };
    if (this.libraryService.isInLibrary(movie.id)) {
      this.libraryService.removeMovie(movie.id);
    } else {
      this.libraryService.addMovie(movie);
    }
  }
}
