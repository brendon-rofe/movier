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
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
