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

  readonly insights = computed(() => this.profileFacade.insights());
  weeklyVisits = computed(() => this.insights()?.access?.weeklyVisits ?? 0);
  weeklyVisitsTrend = computed(() => this.insights()?.access?.growthRate ?? 0);
  storiesViewsIncrease = computed(() => this.insights()?.access?.storiesViewsIncrease ?? 0);
  reelsViewsIncrease = computed(() => this.insights()?.access?.reelsViewsIncrease ?? 0);
  videosViewsIncrease = computed(() => this.insights()?.access?.videosViewsIncrease ?? 0);
  postsViewsIncrease = computed(() => this.insights()?.access?.postsViewsIncrease ?? 0);
  commentsIncrease = computed(() => this.insights()?.interactions?.commentsIncrease ?? 0);
  reactionsIncrease = computed(() => this.insights()?.interactions?.reactionsIncrease ?? 0);
  sharesIncrease = computed(() => this.insights()?.interactions?.sharesIncrease ?? 0);

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
