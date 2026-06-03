import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'search',
    loadComponent: () => import('./search/search.page').then((m) => m.SearchPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'library',
    loadComponent: () => import('./library/library.page').then((m) => m.LibraryPage),
  },
  {
    path: 'detail/:type/:id',
    loadComponent: () => import('./detail/detail.page').then((m) => m.DetailPage),
  },
  {
    path: 'track/:type/:id',
    loadComponent: () => import('./track/track.page').then((m) => m.TrackPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
