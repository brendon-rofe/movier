import { Component, EventEmitter, Input, Output, OnInit, OnChanges, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../../services/notification.service';
import { LinkService } from '../../services/link.service';
import { SharedWatchService } from '../../services/shared-watch.service';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [DatePipe],
  template: `
    @if (isOpen) {
      <div class="notif-backdrop" (click)="close.emit()"></div>
      <div class="notif-dropdown">
        <div class="notif-header">
          <h3 class="notif-title">Notifications</h3>
          <div class="notif-header-actions">
            @if (hasUnread) {
              <button class="mark-all-btn" (click)="markAll()">Mark all read</button>
            }
            @if (notifications.length > 0) {
              <button class="clear-all-btn" (click)="clearAll()">Clear all</button>
            }
          </div>
        </div>
        <div class="notif-list">
          @if (loading) {
            <div class="notif-empty">Loading...</div>
          } @else if (notifications.length === 0) {
            <div class="notif-empty">
              <span class="material-symbols-outlined notif-empty-icon">notifications_off</span>
              <p>No notifications yet</p>
            </div>
          } @else {
            @for (notif of notifications; track notif.id) {
              <div class="notif-item" [class.notif-unread]="!notif.read">
                <div class="notif-item-left">
                  <span class="material-symbols-outlined notif-item-icon">
                    {{ getNotifIcon(notif.type) }}
                  </span>
                </div>
                <div class="notif-item-body">
                  <p class="notif-item-msg">{{ notif.message }}</p>
                  <span class="notif-item-time">{{ notif.createdAt | date:'MMM d, h:mm a' }}</span>
                  @if (notif.type === 'invite_received' && !notif.read && notif.linkId) {
                    <div class="notif-actions">
                      <button class="notif-btn notif-btn-accept" (click)="accept(notif)">Accept</button>
                      <button class="notif-btn notif-btn-reject" (click)="reject(notif)">Reject</button>
                    </div>
                  }
                  @if (notif.type === 'watch_invite' && !notif.read && notif.sharedWatchId) {
                    <div class="notif-actions">
                      <button class="notif-btn notif-btn-accept" (click)="acceptWatchInvite(notif)">Accept</button>
                      <button class="notif-btn notif-btn-reject" (click)="declineWatchInvite(notif)">Decline</button>
                    </div>
                  }
                </div>
                @if (!notif.read && notif.type !== 'invite_received' && notif.type !== 'watch_invite') {
                  <button class="notif-read-btn" (click)="markRead(notif)">
                    <span class="material-symbols-outlined">check</span>
                  </button>
                }
              </div>
            }
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .notif-backdrop {
      position: fixed;
      inset: 0;
      z-index: 199;
      background: transparent;
    }
    .notif-dropdown {
      position: fixed;
      top: 64px;
      right: 16px;
      width: 360px;
      max-height: 480px;
      background: rgba(23, 31, 51, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      z-index: 200;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
    }
    @media (max-width: 420px) {
      .notif-dropdown {
        right: 8px;
        left: 8px;
        width: auto;
      }
    }
    .notif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 16px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .notif-header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .notif-title {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: var(--on-surface, #dae2fd);
      margin: 0;
    }
    .mark-all-btn {
      background: none;
      border: none;
      color: var(--secondary, #7bd0ff);
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
    }
    .mark-all-btn:hover {
      opacity: 0.8;
    }
    .clear-all-btn {
      background: none;
      border: none;
      color: var(--on-surface-variant, #d8c3ad);
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
    }
    .clear-all-btn:hover {
      opacity: 0.8;
      color: #ef4444;
    }
    .mark-all-btn:hover {
      opacity: 0.8;
    }
    .notif-list {
      overflow-y: auto;
      flex: 1;
    }
    .notif-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 16px;
      color: var(--on-surface-variant, #d8c3ad);
      font-family: 'Inter', sans-serif;
      font-size: 14px;
    }
    .notif-empty-icon {
      font-size: 40px;
      opacity: 0.4;
      margin-bottom: 12px;
    }
    .notif-empty p {
      margin: 0;
    }
    .notif-item {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      transition: background 0.2s;
    }
    .notif-item:hover {
      background: rgba(255, 255, 255, 0.03);
    }
    .notif-unread {
      background: rgba(123, 208, 255, 0.03);
    }
    .notif-item-left {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .notif-item-icon {
      font-size: 18px;
      color: var(--secondary, #7bd0ff);
    }
    .notif-item-body {
      flex: 1;
      min-width: 0;
    }
    .notif-item-msg {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: var(--on-surface, #dae2fd);
      margin: 0 0 4px;
      line-height: 1.4;
    }
    .notif-item-time {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      color: var(--on-surface-variant, #d8c3ad);
      opacity: 0.6;
    }
    .notif-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
    .notif-btn {
      padding: 6px 16px;
      border-radius: 8px;
      border: none;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .notif-btn-accept {
      background: var(--primary, #ffc174);
      color: var(--on-primary, #472a00);
    }
    .notif-btn-accept:hover {
      opacity: 0.9;
    }
    .notif-btn-reject {
      background: rgba(255, 255, 255, 0.1);
      color: var(--on-surface-variant, #d8c3ad);
    }
    .notif-btn-reject:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }
    .notif-read-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--on-surface-variant, #d8c3ad);
      opacity: 0.4;
      padding: 4px;
      align-self: flex-start;
      transition: opacity 0.2s;
    }
    .notif-read-btn:hover {
      opacity: 1;
    }
    .notif-read-btn span {
      font-size: 16px;
    }
  `],
})
export class NotificationDropdown implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  notifications: Notification[] = [];
  loading = false;

  get hasUnread() {
    return this.notifications.some((n) => !n.read);
  }

  constructor(
    private notifService: NotificationService,
    private linkService: LinkService,
    private sharedWatchService: SharedWatchService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.isOpen) this.load();
  }

  ngOnChanges() {
    if (this.isOpen) this.load();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) this.close.emit();
  }

  private async load() {
    this.loading = true;
    this.notifService.notifications$.subscribe((n) => this.notifications = n);
    await this.notifService.loadNotifications();
    this.loading = false;
  }

  getNotifIcon(type: string): string {
    switch (type) {
      case 'invite_received': return 'person_add';
      case 'invite_accepted': return 'check_circle';
      case 'watch_invite': return 'visibility';
      case 'watch_accepted': return 'play_circle';
      default: return 'notifications';
    }
  }

  async accept(notif: Notification) {
    if (!notif.linkId) return;
    await this.linkService.acceptInvite(notif.linkId);
    await this.notifService.markAsRead(notif.id);
    await this.notifService.loadNotifications();
  }

  async reject(notif: Notification) {
    if (!notif.linkId) return;
    await this.linkService.rejectInvite(notif.linkId);
    await this.notifService.loadNotifications();
  }

  async acceptWatchInvite(notif: Notification) {
    if (!notif.sharedWatchId) return;
    await this.sharedWatchService.accept(notif.sharedWatchId);
    await this.notifService.markAsRead(notif.id);
    await this.notifService.loadNotifications();
  }

  async declineWatchInvite(notif: Notification) {
    if (!notif.sharedWatchId) return;
    await this.sharedWatchService.decline(notif.sharedWatchId);
    await this.notifService.loadNotifications();
  }

  async markRead(notif: Notification) {
    await this.notifService.markAsRead(notif.id);
  }

  async markAll() {
    await this.notifService.markAllAsRead();
  }

  async clearAll() {
    await this.notifService.clearAll();
  }
}
