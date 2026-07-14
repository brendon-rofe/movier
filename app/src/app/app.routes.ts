import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.page').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
  {
    path: 'search',
    loadComponent: () => import('./search/search.page').then((m) => m.SearchPage),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then((m) => m.SettingsPage),
    canActivate: [authGuard],
  },
  {
    path: 'library',
    loadComponent: () => import('./library/library.page').then((m) => m.LibraryPage),
    canActivate: [authGuard],
  },
  {
    path: 'detail/:type/:id',
    loadComponent: () => import('./detail/detail.page').then((m) => m.DetailPage),
    canActivate: [authGuard],
  },
  {
    path: 'track/:type/:id',
    loadComponent: () => import('./track/track.page').then((m) => m.TrackPage),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
