import {
  Component,
  inject,
  signal,
  HostListener,
  ElementRef,
  ViewChild,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterModule,
  Router
} from '@angular/router';
import { AuthService } from '@fe/core';
import { ProfileFacade } from '../../data-access/profile.facade';

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
  private profileFacade = inject(ProfileFacade);

  @ViewChild('menuDropdown')
  menuDropdown: any;

  user = this.authService.user;

  showMenu = signal(false);

  // Mock metrics for Studio
  videoCount = signal(5);
  viewsCount = signal(120);

  profileData = this.profileFacade.profile;
  location = computed(() => this.profileData()?.location || 'Hồ Chí Minh, Việt Nam');
  from = computed(() => 'Hà Nội, Việt Nam');
  birthday = computed(() => '01/01/1995');
  family = computed(() => 'Độc thân');
  gender = computed(() => 'Nam');

  mockReels = signal([
    { id: 1, title: 'Bí kíp quay video triệu view', views: '1.2M', cover: 'https://picsum.photos/300/500?random=11' },
    { id: 2, title: 'Cách edit video siêu nhanh', views: '850K', cover: 'https://picsum.photos/300/500?random=12' }
  ]);

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
