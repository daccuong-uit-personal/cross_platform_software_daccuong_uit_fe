import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, ThemeService } from '@fe/core';
import { TranslocoModule } from '@jsverse/transloco';
import { toast } from 'ngx-sonner';

import { LoginHeader } from './components/login-header.component';
import { LoginLanguageSelector } from './components/login-language-selector.component';
import { LoginSelection } from './components/login-selection.component';
import { LoginFormEmail } from './components/login-form-email.component';

type LoginView = 'selection' | 'email-login';

@Component({
  standalone: true,
  selector: 'feat-auth-login',
  imports: [
    CommonModule,
    TranslocoModule,
    LoginHeader,
    LoginLanguageSelector,
    LoginSelection,
    LoginFormEmail
  ],
  template: `
    <div
      class="flex flex-col min-h-screen w-full bg-surface-base transition-colors duration-300"
      [class.dark]="isDark()"
      *transloco="let t"
    >
      <!-- Header -->
      <auth-login-header (logoClicked)="currentView.set('selection')" />

      <!-- Main content — centered, with padding-bottom to clear fixed 2-row footer -->
      <div
        class="flex-1 flex flex-col items-center justify-center px-4"
        style="padding-top: 32px; padding-bottom: 130px;"
      >
        <div class="w-full" style="max-width: 480px; display: flex; flex-direction: column; align-items: center;">
          @if (currentView() === 'selection') {
            <auth-login-selection (methodSelected)="onMethodSelected($event)" />
          } @else if (currentView() === 'email-login') {
            <auth-login-form-email
              [isLoading]="isLoading"
              [fieldErrors]="fieldErrors"
              (back)="currentView.set('selection')"
              (sendOtpRequested)="onSendOtp($event)"
              (login)="onLogin($event)"
            />
          }
        </div>
      </div>

      <!-- Fixed footer -->
      <auth-login-language-selector
        [isDark]="isDark()"
        (themeToggled)="toggleTheme()"
      />
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  currentView = signal<LoginView>('selection');
  isDark = computed(() => this.themeService.theme() === 'dark');

  isLoading = false;
  fieldErrors: Record<string, boolean> = {};

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onMethodSelected(method: string) {
    if (method === 'email') {
      this.currentView.set('email-login');
    } else {
      toast.info(`Phương thức ${method} sẽ sớm được hỗ trợ!`);
    }
  }

  onSendOtp(phoneNumber: string) {
    this.authService.sendOtp(phoneNumber).subscribe({
      next: () => {
        toast.success(`Mã OTP đã được gửi đến số điện thoại ${phoneNumber}!`);
      },
      error: (err) => {
        toast.error('Gửi mã OTP thất bại. Vui lòng thử lại!');
      }
    });
  }

  onLogin(credentials: any) {
    this.fieldErrors = {};
    let isValid = true;
    let payload: Record<string, any> = {};

    if (credentials.tab === 'email') {
      if (!credentials.email) {
        this.fieldErrors['email'] = true;
        isValid = false;
      }
      if (!credentials.password) {
        this.fieldErrors['password'] = true;
        isValid = false;
      }
      payload = {
        email: credentials.email,
        password: credentials.password
      };
    } else {
      // Phone tab
      if (!credentials.phone) {
        this.fieldErrors['phone'] = true;
        isValid = false;
      }
      if (credentials.usePassword) {
        if (!credentials.password) {
          this.fieldErrors['password'] = true;
          isValid = false;
        }
        payload = {
          phoneNumber: credentials.countryCode + credentials.phone,
          password: credentials.password
        };
      } else {
        if (!credentials.otp) {
          this.fieldErrors['otp'] = true;
          isValid = false;
        }
        payload = {
          phoneNumber: credentials.countryCode + credentials.phone,
          otp: credentials.otp
        };
      }
    }

    if (!isValid) {
      toast.error('Vui lòng kiểm tra các trường thông tin.');
      return;
    }

    this.isLoading = true;

    this.authService.login(payload).subscribe({
      next: () => {
        this.isLoading = false;
        toast.success('Đăng nhập thành công!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}