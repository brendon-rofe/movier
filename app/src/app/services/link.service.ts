import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserLink {
  id: number;
  requesterId: number;
  receiverId: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  requester?: { id: number; username: string };
  receiver?: { id: number; username: string };
}

@Injectable({ providedIn: 'root' })
export class LinkService {
  private api = environment.apiBaseUrl;
  private linksSubject = new BehaviorSubject<{ sent: UserLink[]; received: UserLink[] }>({ sent: [], received: [] });
  links$ = this.linksSubject.asObservable();

  constructor(private http: HttpClient) {}

  async loadLinks() {
    try {
      const data = await firstValueFrom(this.http.get<{ sent: UserLink[]; received: UserLink[] }>(`${this.api}/links`));
      this.linksSubject.next(data);
    } catch { /* ignore */ }
  }

  async sendInvite(username: string): Promise<void> {
    await firstValueFrom(this.http.post(`${this.api}/links/invite`, { username }));
    await this.loadLinks();
  }

  async acceptInvite(id: number): Promise<void> {
    await firstValueFrom(this.http.post(`${this.api}/links/${id}/accept`, {}));
    await this.loadLinks();
  }

  async rejectInvite(id: number): Promise<void> {
    await firstValueFrom(this.http.post(`${this.api}/links/${id}/reject`, {}));
    await this.loadLinks();
  }

  async unlink(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.api}/links/${id}`));
    await this.loadLinks();
  }
}
