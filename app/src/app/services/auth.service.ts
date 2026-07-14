import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  user: { id: number; username: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiBaseUrl;
  private tokenKey = 'cineTrack_token';
  private userKey = 'cineTrack_user';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): { id: number; username: string } | null {
    try {
      return JSON.parse(localStorage.getItem(this.userKey) || 'null');
    } catch {
      return null;
    }
  }

  async login(username: string, password: string, rememberMe?: boolean): Promise<{ id: number; username: string }> {
    const data = await firstValueFrom(this.http.post<AuthResponse>(`${this.api}/auth/login`, { username, password, rememberMe }));
    localStorage.setItem(this.tokenKey, data.token);
    localStorage.setItem(this.userKey, JSON.stringify(data.user));
    this.loggedIn.next(true);
    return data.user;
  }

  async register(username: string, password: string): Promise<{ id: number; username: string }> {
    const data = await firstValueFrom(this.http.post<AuthResponse>(`${this.api}/auth/register`, { username, password }));
    localStorage.setItem(this.tokenKey, data.token);
    localStorage.setItem(this.userKey, JSON.stringify(data.user));
    this.loggedIn.next(true);
    return data.user;
  }

  async getSecurityQuestion(username: string): Promise<string> {
    const data = await firstValueFrom(this.http.post<{ securityQuestion: string }>(`${this.api}/auth/get-security-question`, { username }));
    return data.securityQuestion;
  }

  async forgotPassword(username: string, securityAnswer: string): Promise<string> {
    const data = await firstValueFrom(this.http.post<{ resetToken: string }>(`${this.api}/auth/forgot-password`, { username, securityAnswer }));
    return data.resetToken;
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    await firstValueFrom(this.http.post<{ message: string }>(`${this.api}/auth/reset-password`, { resetToken, newPassword }));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.loggedIn.next(false);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}
