import {
  Component,
  inject,
  signal,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterModule,
  Router
} from '@angular/router';
import { AuthService } from '@fe/core';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'feat-profile-right-sidebar',
  templateUrl: './profile-right-sidebar.component.html',
  styleUrls: ['./profile-right-sidebar.component.css'],
})
export class ProfileRightSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  @ViewChild('menuDropdown')
  menuDropdown: any;

  user = this.authService.user;

  showMenu = signal(false);

  // Mock metrics for Studio
  videoCount = signal(5);
  viewsCount = signal(120);

  toggleMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showMenu.update(v => !v);
  }

  closeMenu() {
    this.showMenu.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.showMenu() &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.closeMenu();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
