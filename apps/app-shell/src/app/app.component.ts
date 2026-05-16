import { Component, inject } from '@angular/core';
import { AppShellComponent } from './layout';
import { AuthService } from '@fe/core';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  standalone: true,
  imports: [AppShellComponent, NgxSonnerToaster],
  selector: 'app-root',
  template: `
    <app-shell></app-shell>
    <ngx-sonner-toaster position="top-right" richColors />
  `,
})
export class AppComponent {
  private authService = inject(AuthService);

  constructor() {
    this.authService.checkAuth();
  }
}

