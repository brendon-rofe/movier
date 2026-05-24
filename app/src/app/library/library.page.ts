import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

interface LibraryItem {
  title: string;
  subtitle: string;
  image: string;
  type: 'movie' | 'tv';
  progress?: number;
  badge?: string;
  badgePosition?: 'top-right' | 'top-left';
  icon: string;
  iconFilled?: boolean;
}

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss'],
  imports: [IonContent, RouterLink],
})
export class LibraryPage {
  profileImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrTkgyMaeChRKiU67Fi9BPdrK9AycjjEzVRdLraTnQ0P9qEpcXeeMyFUJGsQtKEPgzkkrcE0CdnlA3G_1usIUNHd-I9srVquhMw-EDqhV_IURg5XpaeyUgiGsDNS2XDGiAmnyWIlZ3-EYPUTQlmRAhBNnpO9r2binK9mTcrwoBn2NLDydNudnRga1rgdEf1SuLSj-WMsESOU5YqH0c4y1vjujBmkBd9eYJLbhITnk68jLH_Rxq6EJ9Q2bG2CYCdwtORMYnyWJGg_E';

  activeTab = 'watchlist';

  items: LibraryItem[] = [
    {
      title: 'Stranger Horizons',
      subtitle: 'S2:E8 of 10',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTdiAoDJzPB4AGwLz0a0JDOeD3ElJGNapfULHuPOJyVB1HGJdUXLxLx5le_cYJC9w2wIS5-H1N3RI8hcjhoojTcajrEVVNuw60PN0tVkf49uyVJjg1nYTFoi48jAdSfq3ofHWy1YVbyJJxjp0r7sD5axUyqfzkTuyt07NjAk1f7JbYkazN2BljPUK9vAeBoeQAQf3mW0PKTPUzQHORPF6WxhryLHlIHmckcBSmBVQ2_TDyWcikw6bfuSnrMCkLDUylf2ZljkxlAzQ',
      type: 'tv',
      progress: 75,
      badge: '4K',
      icon: 'check_circle',
      iconFilled: true,
    },
    {
      title: 'Nightfall Protocol',
      subtitle: '2h 14m',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMNo2L0rSWx3wTX7uLL1rb_HB2TX0egfhXHmZDrXGTnaxYxn6kds7meu9ix3_iype_vLTrZDQAaeZ3t9glMGNnIccnvLManP73xvkBBmYAHXq3oKZ11PIHKqu4GfZxmec4j1SFK-L7IW4onGiCRxmHXbX9-Iv69Nhku__3rrayxzGbmo68pucQBo8ts5W-Q8fDVRhJSYRg5qt3a2mjqKJu_6MzRP_Rf72dLimdu0zBXH_AfF6BzPqh4ohQX-7U3x-Zn4sDLgGAcd8',
      type: 'movie',
      badge: '9.2',
      icon: 'bookmark',
    },
    {
      title: 'Kingdom of Dust',
      subtitle: 'S1:E2 of 12',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHLbb7H77mIDgsMWyR4maO12AEKOiK1RWLBwUUxLrJ3f5X2DX-BohhP5nStyW5nl-oa3SYPXQy0FgrI0x1zmfJC_5l4MJrQs8QHUSyKin6Z9RI0LDbUahYXqdnubSwRCEYravFZptXX9EQQiLExzzJP0KcGlJqhHLPjVkHpO71hzx0SaxI89SSm8-naYTC_JdWNp8Y_xL_mKCweNimVOvWcDVIG6fNBndCgYhWWbjn7oh6FaAmO0_N7m7Fu81buq80X7-7DvkGqXw',
      type: 'tv',
      progress: 20,
      icon: 'more_vert',
    },
    {
      title: 'Nebula Garden',
      subtitle: '1h 45m',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBybuy_WkV7JYVfTtPKw4m4T9nF8UmNup7PGdvMwooSkWOAINtaePoU2l8CLviM9PKErqyR42dQGChgEVeFqwEC3PySUpLWlzRMZODremwxYN6DeFCyeZUqtdISqdgbXvwlhVOLmuZsKQgdCnO2Ia_VKezO_3AEQT8KiaM1reATh-PB6eGeNHt1W8m75WYcFhm0dQEDP9Xr_MuI2NzzwPDtSLGS7PmEC_se-9Qt6FhNKpekz1UaC5t0X0DBMXPsgtEwiX_Qpw2auQw',
      type: 'movie',
      badge: 'FAVE',
      badgePosition: 'top-left',
      icon: 'favorite',
      iconFilled: true,
    },
    {
      title: 'Silicon Dreams',
      subtitle: 'Completed',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp3iKA3HqhyptIdkhZ8FvyRP13gUDDPP5cugxibxNOULVy3kZiVUmV4Demlg0buY3uFdJmYcpcb2tezHGz2vUkv3vxLkr-G28FprnVzLX0gVzjWdhbgT0GWNB8mIheI90KZDo3x367QDHlihSckVgu97HWoO9mHGqecnBzVNkC0pjNb_GIF-I1z9F5QPuIfkMf9LyyEcKJ8mye7iAOhtjTJd6HAEbBoZfwXcKF5qtDFJijivEaiLaNu87ZJyJGSANvVMsZnuDhyAk',
      type: 'tv',
      progress: 100,
      icon: 'check_circle',
      iconFilled: true,
    },
  ];

  weeklyStats = {
    hours: '18h',
    count: 42,
    description: 'You\'ve completed 4 movies and 12 episodes this week. You\'re in the top 5% of movie buffs!',
  };

  switchTab(tab: string) {
    this.activeTab = tab;
  }
}
