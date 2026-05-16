import { Component, inject } from '@angular/core';
import { AppShellComponent } from './layout';
import { AuthService } from '@fe/core';

@Component({
  standalone: true,
  imports: [AppShellComponent],
  selector: 'app-root',
  template: '<app-shell></app-shell>',
})
export class AppComponent {
  private authService = inject(AuthService);

  constructor() {
    this.authService.checkAuth();
  }
}

