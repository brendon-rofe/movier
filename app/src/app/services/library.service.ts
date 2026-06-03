import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from './movie.service';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  library = new BehaviorSubject<Movie[]>([]);
  library$: Observable<Movie[]> = this.library.asObservable();

  addMovie(movie: Movie) {
    const current = this.library.value;
    if (!current.some((m) => m.id === movie.id)) {
      this.library.next([...current, movie]);
    }
  }

  removeMovie(movieId: number) {
    this.library.next(this.library.value.filter((m) => m.id !== movieId));
  }

  isInLibrary(movieId: number): boolean {
    return this.library.value.some((m) => m.id === movieId);
  }
}
