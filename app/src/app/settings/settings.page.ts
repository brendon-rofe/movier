import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LinkService, UserLink } from '../services/link.service';
import { NotificationService } from '../services/notification.service';
import { SharedWatchService, SharedWatch } from '../services/shared-watch.service';
import { NotificationDropdown } from '../components/notification-dropdown/notification-dropdown';

interface SettingItem {
  icon: string;
  label: string;
  description: string;
  action?: string;
  toggle?: boolean;
  toggled?: boolean;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  imports: [IonContent, RouterLink, FormsModule, NotificationDropdown],
})
export class SettingsPage implements OnInit, OnDestroy {
  user = this.auth.getUser();
  notifOpen = false;
  unreadCount = 0;
  securityQuestion = '';
  securityAnswer = '';
  existingQuestion = '';
  showSecurityForm = false;
  securityLoading = false;
  securityError = '';
  securitySuccess = '';
  inviteUsername = '';
  showInviteForm = false;
  inviteError = '';
  inviteSuccess = '';
  sentLinks: UserLink[] = [];
  receivedLinks: UserLink[] = [];
  sharedWatches: SharedWatch[] = [];
  private notifSub?: Subscription;
  private linkSub?: Subscription;
  private watchSub?: Subscription;

  get acceptedLinks(): UserLink[] {
    return [...this.sentLinks.filter((l) => l.status === 'accepted'), ...this.receivedLinks.filter((l) => l.status === 'accepted')];
  }

  get pendingReceived(): UserLink[] {
    return this.receivedLinks.filter((l) => l.status === 'pending');
  }

  get pendingSent(): UserLink[] {
    return this.sentLinks.filter((l) => l.status === 'pending');
  }

  getPartner(link: UserLink): string {
    if (link.requester && link.requester.username !== this.user?.username) return link.requester.username;
    if (link.receiver && link.receiver.username !== this.user?.username) return link.receiver.username;
    return '';
  }

  getWatchPartner(w: SharedWatch): string {
    if (w.owner && w.owner.username !== this.user?.username) return w.owner.username;
    if (w.partner && w.partner.username !== this.user?.username) return w.partner.username;
    return '';
  }

  settingSections: SettingSection[] = [
    {
      title: 'Profile',
      items: [
        { icon: 'person', label: 'Account', description: 'Manage your personal information and sign-in methods', action: 'chevron_right' },
        { icon: 'verified', label: 'Subscription', description: 'Premium Plan · Renews on Dec 12, 2026', action: 'chevron_right' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'notifications', label: 'Notifications', description: 'Manage push and email alerts', action: 'chevron_right' },
        { icon: 'dark_mode', label: 'Dark Mode', description: 'Always on', toggle: true, toggled: true },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: 'info', label: 'About CineTrack', description: 'Version 1.0.0', action: 'chevron_right' },
        { icon: 'description', label: 'Terms of Service', description: '', action: 'chevron_right' },
        { icon: 'shield', label: 'Privacy Policy', description: '', action: 'chevron_right' },
      ],
    },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private linkService: LinkService,
    private notifService: NotificationService,
    private sharedWatchService: SharedWatchService,
  ) {}

  ngOnInit() {
    this.notifSub = this.notifService.unreadCount$.subscribe((c) => this.unreadCount = c);
    this.linkService.loadLinks();
    this.linkSub = this.linkService.links$.subscribe((links) => {
      this.sentLinks = links.sent;
      this.receivedLinks = links.received;
    });
    this.sharedWatchService.loadWatches();
    this.watchSub = this.sharedWatchService.watches$.subscribe((w) => {
      this.sharedWatches = [...w.owned, ...w.partnered].filter((sw) => sw.status === 'accepted');
    });
    this.checkSecurityQuestion();
  }

  ngOnDestroy() {
    this.notifSub?.unsubscribe();
    this.linkSub?.unsubscribe();
    this.watchSub?.unsubscribe();
  }

  toggleNotifications() {
    this.notifOpen = !this.notifOpen;
  }

  closeNotifications() {
    this.notifOpen = false;
  }

  async checkSecurityQuestion() {
    if (!this.user) return;
    try {
      const question = await this.auth.getSecurityQuestion(this.user.username);
      this.existingQuestion = question;
    } catch {
      this.existingQuestion = '';
    }
  }

  async saveSecurityQuestion() {
    if (!this.securityQuestion.trim() || !this.securityAnswer.trim()) {
      this.securityError = 'Please fill in both fields';
      return;
    }
    this.securityLoading = true;
    this.securityError = '';
    this.securitySuccess = '';
    try {
      await this.auth.setSecurityQuestion(this.securityQuestion.trim(), this.securityAnswer.trim());
      this.existingQuestion = this.securityQuestion.trim();
      this.securityQuestion = '';
      this.securityAnswer = '';
      this.showSecurityForm = false;
      this.securitySuccess = 'Security question saved';
    } catch (e: any) {
      this.securityError = e.error?.error || 'Failed to save security question';
    } finally {
      this.securityLoading = false;
    }
  }

  async sendInvite() {
    if (!this.inviteUsername.trim()) return;
    this.inviteError = '';
    this.inviteSuccess = '';
    try {
      await this.linkService.sendInvite(this.inviteUsername.trim());
      this.inviteSuccess = `Invite sent to ${this.inviteUsername.trim()}`;
      this.inviteUsername = '';
      this.showInviteForm = false;
    } catch (e: any) {
      this.inviteError = e.error?.error || 'Failed to send invite';
    }
  }

  async acceptInvite(linkId: number) {
    await this.linkService.acceptInvite(linkId);
  }

  async rejectInvite(linkId: number) {
    await this.linkService.rejectInvite(linkId);
  }

  async unlink(linkId: number) {
    const confirmed = confirm('Are you sure you want to unlink this user?');
    if (!confirmed) return;
    await this.linkService.unlink(linkId);
  }

  async removeSharedWatch(id: number) {
    const confirmed = confirm('Remove this shared watch?');
    if (!confirmed) return;
    await this.sharedWatchService.remove(id);
  }

  signOut() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleItem(sectionIndex: number, itemIndex: number) {
    const item = this.settingSections[sectionIndex].items[itemIndex];
    if (item.toggle) {
      item.toggled = !item.toggled;
    }
  }
}
