import { Component, inject } from '@angular/core';
import { AppShellComponent } from './layout';
import { AuthService } from 'core';

@Component({
  standalone: true,
  imports: [AppShellComponent],
  selector: 'app-root',
  template: '<app-shell></app-shell>',
})
export class App {
  private authService = inject(AuthService);

  constructor() {
    this.authService.checkAuth();
  }
}
