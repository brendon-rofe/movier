import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [IonContent, RouterLink, FormsModule],
})
export class LoginPage {
  username = '';
  password = '';
  rememberMe = false;
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  async login() {
    if (!this.username || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      await this.auth.login(this.username, this.password, this.rememberMe);
      this.router.navigate(['/home']);
    } catch (e: any) {
      this.error = e.error?.error || 'Login failed';
    } finally {
      this.loading = false;
    }
  }
}
