import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MovieService, Movie } from '../services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, RouterLink],
})
export class HomePage implements OnInit {
  popularMovies: Movie[] = [];
  profileImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4YV5ni1aKb4BqdMdcucLHbKZy_ZYbTt67rWT2Cc_BdCRMUn-sbw1t_FWDrR4q6H87ir5CwIu-FZ4-htLBswHRwwwLphQJo4vIReCmkNAP_qgX56_M9otTW7uga_mub84fDbDQcBj7ULcdYenGX4aj9frRDfS3uid7p3St1FsozDHLpdGnfkkcYXUfKTfy8UjYBruezKaEuh7sLIQU5_iIGW4Z89YdYRTIWsZwuAfHfccJABnC8kIICwnjxXkgCPWC_8jUpZaNb-M';

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getPopularMovies().subscribe((movies) => {
      this.popularMovies = movies.slice(0, 6);
    });
  }

  getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path, 'w500');
  }

  getBackdropUrl(path: string | null): string {
    return this.movieService.getImageUrl(path, 'w780');
  }
}
