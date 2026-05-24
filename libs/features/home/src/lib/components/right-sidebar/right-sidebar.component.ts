import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '@fe/core';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'fe-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css'],
})
export class RightSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.user;
  showMenu = signal(false);
  isHome = signal(true);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isHome.set(event.url === '/home' || event.url === '/');
    });
    this.isHome.set(this.router.url === '/home' || this.router.url === '/');
  }

  toggleMenu() {
    this.showMenu.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
