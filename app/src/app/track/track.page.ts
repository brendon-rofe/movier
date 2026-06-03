import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MovieService, MovieDetails, TvDetails, SeasonDetails, TvEpisode } from '../services/movie.service';
import { TrackingService, MovieWatchStatus } from '../services/tracking.service';

@Component({
  selector: 'app-track',
  templateUrl: 'track.page.html',
  styleUrls: ['track.page.scss'],
  imports: [IonContent],
})
export class TrackPage implements OnInit {
  type: 'movie' | 'tv' = 'movie';
  movie: MovieDetails | null = null;
  tvShow: TvDetails | null = null;
  seasons: SeasonDetails[] = [];
  selectedSeason = 1;
  loading = false;

  statusOptions: { value: MovieWatchStatus; label: string; icon: string }[] = [
    { value: 'want_to_watch', label: 'Want to Watch', icon: 'bookmark' },
    { value: 'watching', label: 'Watching', icon: 'visibility' },
    { value: 'watched', label: 'Watched', icon: 'check_circle' },
    { value: 'dropped', label: 'Dropped', icon: 'not_interested' },
  ];

  get seasonsNav(): number[] {
    if (!this.tvShow) return [];
    const arr: number[] = [];
    for (let i = 1; i <= this.tvShow.number_of_seasons; i++) {
      arr.push(i);
    }
    return arr;
  }

  get currentSeason(): SeasonDetails | undefined {
    return this.seasons.find((s) => s.season_number === this.selectedSeason);
  }

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    public tracking: TrackingService,
  ) {}

  ngOnInit() {
    this.type = (this.route.snapshot.paramMap.get('type') as 'movie' | 'tv') || 'movie';
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.type === 'movie') {
      this.movieService.getMovieDetails(id).subscribe((data) => {
        this.movie = data;
      });
    } else {
      this.movieService.getTvDetails(id).subscribe((data) => {
        this.tvShow = data;
        this.tracking.setTvTotalEpisodes(id, data.number_of_episodes);
        this.selectedSeason = 1;
        this.loadSeason(1);
      });
    }
  }

  loadSeason(num: number) {
    if (!this.tvShow) return;
    this.loading = true;
    this.movieService.getSeasonDetails(this.tvShow.id, num).subscribe((data) => {
      const existing = this.seasons.findIndex((s) => s.season_number === num);
      if (existing >= 0) {
        this.seasons[existing] = data;
      } else {
        this.seasons.push(data);
      }
      this.loading = false;
    });
  }

  selectSeason(num: number) {
    this.selectedSeason = num;
    if (!this.seasons.find((s) => s.season_number === num)) {
      this.loadSeason(num);
    }
  }

  setStatus(status: MovieWatchStatus) {
    if (!this.movie) return;
    this.tracking.setMovieStatus(this.movie.id, status);
  }

  getCurrentStatus(): MovieWatchStatus | null {
    if (!this.movie) return null;
    const data = this.tracking.getMovieData(this.movie.id);
    return data?.status ?? null;
  }

  toggleEpisode(episode: TvEpisode) {
    if (!this.tvShow) return;
    this.tracking.toggleEpisode(this.tvShow.id, episode.season_number, episode.episode_number);
  }

  toggleSeason(seasonNum: number) {
    if (!this.tvShow) return;
    const seasonInfo = this.tvShow.seasons.find(s => s.season_number === seasonNum);
    if (!seasonInfo || seasonInfo.episode_count === 0) return;
    this.tracking.toggleSeason(this.tvShow.id, seasonNum, seasonInfo.episode_count);
  }

  isSeasonChecked(seasonNum: number): boolean {
    if (!this.tvShow) return false;
    const seasonInfo = this.tvShow.seasons.find(s => s.season_number === seasonNum);
    if (!seasonInfo || seasonInfo.episode_count === 0) return false;
    return this.tracking.isSeasonFullyWatched(this.tvShow.id, seasonNum, seasonInfo.episode_count);
  }

  goBack() {
    window.history.back();
  }

  getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path, 'w342');
  }
}
