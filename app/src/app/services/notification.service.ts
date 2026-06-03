import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: number;
  userId: number;
  type: string;
  fromUserId: number;
  fromUser: { id: number; username: string };
  message: string;
  read: boolean;
  linkId?: number;
  sharedWatchId?: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = environment.apiBaseUrl;
  private unreadSubject = new BehaviorSubject<number>(0);
  private notifSubject = new BehaviorSubject<Notification[]>([]);
  private pollTimer: any;

  unreadCount$ = this.unreadSubject.asObservable();
  notifications$ = this.notifSubject.asObservable();

  constructor(
    private http: HttpClient,
    private zone: NgZone,
  ) {
    this.loadUnreadCount();
    this.startPolling();
  }

  private async loadUnreadCount() {
    try {
      const data = await firstValueFrom(this.http.get<{ count: number }>(`${this.api}/notifications/unread-count`));
      this.unreadSubject.next(data.count);
    } catch { /* ignore */ }
  }

  async loadNotifications() {
    try {
      const data = await firstValueFrom(this.http.get<{ notifications: Notification[] }>(`${this.api}/notifications`));
      this.notifSubject.next(data.notifications);
      await this.loadUnreadCount();
    } catch { /* ignore */ }
  }

  async markAsRead(id: number) {
    await firstValueFrom(this.http.post(`${this.api}/notifications/${id}/read`, {}));
    await this.loadUnreadCount();
    const current = this.notifSubject.value.map((n) => n.id === id ? { ...n, read: true } : n);
    this.notifSubject.next(current);
  }

  async markAllAsRead() {
    await firstValueFrom(this.http.post(`${this.api}/notifications/read-all`, {}));
    await this.loadUnreadCount();
    const current = this.notifSubject.value.map((n) => ({ ...n, read: true }));
    this.notifSubject.next(current);
  }

  async clearAll() {
    await firstValueFrom(this.http.delete(`${this.api}/notifications`));
    this.notifSubject.next([]);
    this.unreadSubject.next(0);
  }

  private startPolling() {
    this.zone.runOutsideAngular(() => {
      this.pollTimer = setInterval(() => {
        this.zone.run(() => this.loadUnreadCount());
      }, 60000);
    });
  }

  stopPolling() {
    if (this.pollTimer) clearInterval(this.pollTimer);
  }
}
