import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@fe/core';
import { ProfileService } from '@fe/domain/profile';

@Component({
  standalone: true,
  selector: 'feat-profile-page',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  displayName = '';
  username = '';
  email = '';
  status = '';
  saving = false;

  activeTab = 'posts';
  
  // Dummy data for UI presentation
  friendsCount = '1.2K';
  
  constructor() {
    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.displayName = user.displayName ?? '';
        this.username = user.username ?? '';
        this.email = user.email ?? '';
      }
    });
  }

  save() {
    const user = this.authService.user();
    if (!user?.id) {
      this.status = 'Vui lòng đăng nhập lại trước khi cập nhật hồ sơ.';
      return;
    }

    this.saving = true;
    this.status = '';

    this.profileService
      .updateProfile(user.id, {
        displayName: this.displayName,
        username: this.username,
      })
      .subscribe({
        next: () => {
          this.status = 'Lưu hồ sơ thành công.';
          this.authService.checkAuth();
        },
        error: () => {
          this.status = 'Không thể lưu hồ sơ. Vui lòng thử lại sau.';
        },
        complete: () => {
          this.saving = false;
        },
      });
  }

  goBack() {
    this.router.navigate(['/']);
  }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
