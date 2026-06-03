import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SharedWatch {
  id: number;
  tmdbId: number;
  mediaType: string;
  title: string;
  ownerId: number;
  partnerId: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  owner?: { id: number; username: string };
  partner?: { id: number; username: string };
}

@Injectable({ providedIn: 'root' })
export class SharedWatchService {
  private api = environment.apiBaseUrl;
  private watchesSubject = new BehaviorSubject<{ owned: SharedWatch[]; partnered: SharedWatch[] }>({ owned: [], partnered: [] });
  watches$ = this.watchesSubject.asObservable();

  constructor(private http: HttpClient) {}

  async loadWatches() {
    try {
      const data = await firstValueFrom(this.http.get<{ owned: SharedWatch[]; partnered: SharedWatch[] }>(`${this.api}/shared-watches`));
      this.watchesSubject.next(data);
    } catch { /* ignore */ }
  }

  async invite(username: string, tmdbId: number, mediaType: string, title: string): Promise<void> {
    await firstValueFrom(this.http.post(`${this.api}/shared-watches/invite`, { username, tmdbId, mediaType, title }));
    await this.loadWatches();
  }

  async accept(id: number): Promise<void> {
    await firstValueFrom(this.http.post(`${this.api}/shared-watches/${id}/accept`, {}));
    await this.loadWatches();
  }

  async decline(id: number): Promise<void> {
    await firstValueFrom(this.http.post(`${this.api}/shared-watches/${id}/decline`, {}));
    await this.loadWatches();
  }

  async remove(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.api}/shared-watches/${id}`));
    await this.loadWatches();
  }
}
