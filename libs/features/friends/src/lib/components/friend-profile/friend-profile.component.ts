import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButton } from '@fe/ui';
// No explicit Friend type exported; using any

@Component({
  selector: 'feat-friend-profile',
  standalone: true,
  imports: [CommonModule, UiButton],
  templateUrl: './friend-profile.component.html',
  styleUrls: ['./friend-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendProfileComponent {
  @Input() friend?: any; // replace with proper type when available
  avatarUrl() {
    const name = this.friend?.displayName || this.friend?.name || this.friend?.username || 'User';
    return this.friend?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=333&color=fff`;
  }

  coverUrl() {
    return this.friend?.coverUrl || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18';
  }

  profileHandle() {
    const username = this.friend?.username;
    return username ? `@${username}` : '@nguoi_dung';
  }
}
