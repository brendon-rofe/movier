import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { MovieService, MovieDetails, Movie } from '../services/movie.service';
import { LibraryService } from '../services/library.service';

@Component({
  selector: 'app-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss'],
  imports: [IonContent, DatePipe],
})
export class DetailPage implements OnInit {
  movie: MovieDetails | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    public libraryService: LibraryService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getMovieDetails(id).subscribe((data) => {
      this.movie = data;
    });
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    return this.movieService.getImageUrl(path, size);
  }

  toggleLibrary() {
    if (!this.movie) return;
    const movie: Movie = {
      id: this.movie.id,
      title: this.movie.title,
      overview: this.movie.overview,
      poster_path: this.movie.poster_path,
      backdrop_path: this.movie.backdrop_path,
      vote_average: this.movie.vote_average,
      release_date: this.movie.release_date,
      genre_ids: this.movie.genres.map((g) => g.id),
    };
    if (this.libraryService.isInLibrary(movie.id)) {
      this.libraryService.removeMovie(movie.id);
    } else {
      this.libraryService.addMovie(movie);
    }
  }

  goBack() {
    window.history.back();
  }
}
