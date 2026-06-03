import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { SharedWatchService } from '../../services/shared-watch.service';
import { UserLink } from '../../services/link.service';

@Component({
  selector: 'app-watch-invite-modal',
  standalone: true,
  template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="close.emit()"></div>
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Watch with someone?</h3>
          <button class="modal-close-btn" (click)="close.emit()">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body">
          @if (msg) {
            <p class="modal-msg">{{ msg }}</p>
          }
          @if (linkedUsers.length === 0) {
            <p class="modal-empty">No linked users available</p>
          }
          <div class="modal-list">
            @for (link of linkedUsers; track link.id) {
              <button class="modal-user-btn" (click)="sendInvite(link)">
                <span class="material-symbols-outlined">person</span>
                <span>{{ getPartner(link) }}</span>
              </button>
            }
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-dismiss" (click)="dismiss.emit()">Not now</button>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 299;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
    }
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 300;
      width: 90%;
      max-width: 360px;
      background: rgba(23, 31, 51, 0.98);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 0;
    }
    .modal-title {
      font-family: 'Inter', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--on-surface, #dae2fd);
      margin: 0;
    }
    .modal-close-btn {
      background: none;
      border: none;
      color: var(--on-surface-variant, #d8c3ad);
      cursor: pointer;
      padding: 4px;
      display: flex;
    }
    .modal-close-btn:hover {
      color: var(--on-surface, #dae2fd);
    }
    .modal-body {
      padding: 16px 20px;
    }
    .modal-msg {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: var(--secondary, #7bd0ff);
      margin: 0 0 12px;
    }
    .modal-empty {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: var(--on-surface-variant, #d8c3ad);
      margin: 0;
      text-align: center;
      padding: 8px 0;
    }
    .modal-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .modal-user-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(255, 255, 255, 0.03);
      color: var(--on-surface, #dae2fd);
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .modal-user-btn:hover {
      background: rgba(123, 208, 255, 0.12);
    }
    .modal-user-btn span:first-child {
      font-size: 20px;
      color: var(--secondary, #7bd0ff);
    }
    .modal-footer {
      padding: 0 20px 16px;
      display: flex;
      justify-content: center;
    }
    .modal-dismiss {
      background: none;
      border: none;
      color: var(--on-surface-variant, #d8c3ad);
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      cursor: pointer;
      padding: 8px;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .modal-dismiss:hover {
      opacity: 1;
    }
  `],
})
export class WatchInviteModal {
  @Input() isOpen = false;
  @Input() linkedUsers: UserLink[] = [];
  @Input() tmdbId = 0;
  @Input() mediaType: 'movie' | 'tv' = 'movie';
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();
  @Output() inviteSent = new EventEmitter<void>();

  msg = '';

  constructor(private sharedWatchService: SharedWatchService) {}

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) this.close.emit();
  }

  getPartner(link: UserLink): string {
    if (link.requester?.username) return link.requester.username;
    if (link.receiver?.username) return link.receiver.username;
    return '';
  }

  async sendInvite(link: UserLink) {
    const partner = this.getPartner(link);
    try {
      await this.sharedWatchService.invite(partner, this.tmdbId, this.mediaType, this.title);
      this.msg = `Invite sent to ${partner}!`;
      this.inviteSent.emit();
      setTimeout(() => this.dismiss.emit(), 1200);
    } catch (e: any) {
      this.msg = e.error?.error || 'Failed to send invite';
    }
  }
}
