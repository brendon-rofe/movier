import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: 'forgot-password.page.html',
  styleUrls: ['forgot-password.page.scss'],
  imports: [IonContent, RouterLink, FormsModule],
})
export class ForgotPasswordPage {
  step: 'username' | 'reset' = 'username';
  username = '';
  securityQuestion = '';
  securityAnswer = '';
  newPassword = '';
  confirmPassword = '';
  resetToken = '';
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

  async fetchQuestion() {
    if (!this.username) {
      this.error = 'Please enter your username';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      const question = await this.auth.getSecurityQuestion(this.username);
      this.securityQuestion = question;
      this.step = 'reset';
    } catch (e: any) {
      this.error = e.error?.error || 'Failed to verify username';
    } finally {
      this.loading = false;
    }
  }

  async resetPassword() {
    if (!this.securityAnswer) {
      this.error = 'Please answer the security question';
      return;
    }
    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      const token = await this.auth.forgotPassword(this.username, this.securityAnswer);
      await this.auth.resetPassword(token, this.newPassword);
      this.router.navigate(['/login']);
    } catch (e: any) {
      this.error = e.error?.error || 'Password reset failed';
    } finally {
      this.loading = false;
    }
  }
}
