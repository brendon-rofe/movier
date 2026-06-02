import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

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
  imports: [IonContent, RouterLink],
})
export class SettingsPage {
  profileImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4YV5ni1aKb4BqdMdcucLHbKZy_ZYbTt67rWT2Cc_BdCRMUn-sbw1t_FWDrR4q6H87ir5CwIu-FZ4-htLBswHRwwwLphQJo4vIReCmkNAP_qgX56_M9otTW7uga_mub84fDbDQcBj7ULcdYenGX4aj9frRDfS3uid7p3St1FsozDHLpdGnfkkcYXUfKTfy8UjYBruezKaEuh7sLIQU5_iIGW4Z89YdYRTIWsZwuAfHfccJABnC8kIICwnjxXkgCPWC_8jUpZaNb-M';

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
        { icon: 'language', label: 'Language & Region', description: 'English (US)', action: 'chevron_right' },
        { icon: 'dark_mode', label: 'Dark Mode', description: 'Always on', toggle: true, toggled: true },
        { icon: 'hd', label: 'Auto-Play Next Episode', description: 'Continue watching seamlessly', toggle: true, toggled: true },
      ],
    },
    {
      title: 'Playback',
      items: [
        { icon: 'speed', label: 'Playback Speed', description: 'Normal (1.0x)', action: 'chevron_right' },
        { icon: 'subtitles', label: 'Subtitles & Captions', description: 'Always show subtitles', action: 'chevron_right' },
        { icon: 'download', label: 'Download Quality', description: 'High (1080p)', action: 'chevron_right' },
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

  toggleItem(sectionIndex: number, itemIndex: number) {
    const item = this.settingSections[sectionIndex].items[itemIndex];
    if (item.toggle) {
      item.toggled = !item.toggled;
    }
  }
}
