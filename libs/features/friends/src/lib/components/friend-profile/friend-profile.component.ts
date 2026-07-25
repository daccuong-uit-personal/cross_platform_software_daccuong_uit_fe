import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButton } from '@fe/ui';
import { PostCardComponent } from '@fe/ui';
import { ProfileService } from '@fe/domain/profile';
import { take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
// No explicit Friend type exported; using any

@Component({
  selector: 'feat-friend-profile',
  standalone: true,
  imports: [CommonModule, UiButton, PostCardComponent],
  templateUrl: './friend-profile.component.html',
  styleUrls: ['./friend-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendProfileComponent implements OnChanges {
  @Input() friend?: any;

  private readonly profileService = inject(ProfileService);

  posts = signal<any[]>([]);
  isLoadingPosts = signal(false);

  mockReels = [
    { id: 1, title: 'Bí kíp quay video triệu view', views: '1.2M', cover: 'https://picsum.photos/300/500?random=41' },
    { id: 2, title: 'Cách edit video siêu nhanh', views: '850K', cover: 'https://picsum.photos/300/500?random=42' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['friend'] && this.friend?.id) {
      this.loadPosts(this.friend.id);
    }
  }

  private loadPosts(userId: string): void {
    this.isLoadingPosts.set(true);
    this.profileService.getProfileTabData(userId, 'posts', 1, 10)
      .pipe(
        take(1),
        catchError(() => of({ data: [] }))
      )
      .subscribe(res => {
        this.posts.set((res.data as any[]) ?? []);
        this.isLoadingPosts.set(false);
      });
  }

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
