import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@fe/core';
import {
  PageShellComponent,
  SidebarMenuItem,
  UiButton,
  PostCardComponent,
  ProfileFriendCardComponent,
  ProfileGroupCardComponent,
} from '@fe/ui';
import { ProfileRightSidebarComponent } from '../components/profile-right-sidebar/profile-right-sidebar.component';
import {
  ProfileTab,
  ProfileTabId,
  ProfilePost,
  ProfileFriend,
  ProfileGroup,
} from '@fe/domain/profile';
import {
  MOCK_PROFILE_TABS,
  MOCK_PROFILE_POSTS,
  MOCK_PROFILE_FRIENDS,
  MOCK_PROFILE_GROUPS,
} from '@fe/domain/profile';

@Component({
  standalone: true,
  selector: 'feat-profile-page',
  imports: [CommonModule, RouterModule, PageShellComponent, ProfileRightSidebarComponent, UiButton, PostCardComponent, ProfileFriendCardComponent, ProfileGroupCardComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);

  displayName = '';
  username = '';
  friendsCount = '1.2K';

  tabs = signal<ProfileTab[]>([...MOCK_PROFILE_TABS]);
  activeTab = signal<ProfileTabId>('posts');
  activeTabLabel = computed(() => this.tabs().find((tab) => tab.id === this.activeTab())?.label ?? '');

  posts = signal<ProfilePost[]>(MOCK_PROFILE_POSTS);
  friends = signal<ProfileFriend[]>(MOCK_PROFILE_FRIENDS);
  groups = signal<ProfileGroup[]>(MOCK_PROFILE_GROUPS);

  mockReels = signal([
    { id: 1, title: 'Bí kíp quay video triệu view', views: '1.2M', cover: 'https://picsum.photos/300/500?random=11' },
    { id: 2, title: 'Cách edit video siêu nhanh', views: '850K', cover: 'https://picsum.photos/300/500?random=12' },
    { id: 3, title: 'Hướng dẫn sử dụng Reals AI', views: '2.1M', cover: 'https://picsum.photos/300/500?random=13' },
    { id: 4, title: 'Trend biến hình mới nhất', views: '450K', cover: 'https://picsum.photos/300/500?random=14' },
    { id: 5, title: 'Vlog một ngày làm việc', views: '1.5M', cover: 'https://picsum.photos/300/500?random=15' },
    { id: 6, title: 'Góc làm việc cực chill', views: '980K', cover: 'https://picsum.photos/300/500?random=16' }
  ]);

  mockStories = signal([
    { id: 1, title: 'Bí Ẩn Mùa Hè', status: 'Đang ra • 45 chương', genre: 'Tiểu thuyết, Bí ẩn, Hành động', desc: 'Một câu chuyện hấp dẫn về những bí ẩn chưa có lời giải đáp trong mùa hè năm ấy. Cùng nhân vật chính khám phá những bí mật rùng rợn và lãng mạn được che giấu kỹ lưỡng dưới lớp vỏ bọc bình yên.', likes: '1.2K', comments: '450', shares: '32', views: '5.6K' },
    { id: 2, title: 'Hành Trình Tới Tương Lai', status: 'Hoàn thành • 120 chương', genre: 'Khoa học viễn tưởng, Phiêu lưu', desc: 'Chuyến thám hiểm đến hành tinh xa xôi với những sinh vật kỳ lạ và nền văn minh vượt bậc. Những con người dũng cảm phải đối mặt với thử thách sinh tử để tìm ra câu trả lời cho sự tồn tại của nhân loại.', likes: '3.4K', comments: '1.2K', shares: '150', views: '12.5K' }
  ]);

  menuItems: SidebarMenuItem[] = [
    {
      id: 'home',
      label: 'Trang chủ',
      svgIcon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8.5Z"></path><path d="M9 21V12h6v9"></path></svg>',
      link: '/home',
      exactMatch: true,
    },
    {
      id: 'reels',
      label: 'Reels',
      svgIcon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="M9 7v10l7-5L9 7Z"></path></svg>',
      link: '/home/reels',
    },
    {
      id: 'discover',
      label: 'Khám phá',
      svgIcon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.5-4.5"></path></svg>',
      link: '/home/discover',
    },
    {
      id: 'notifications',
      label: 'Thông báo',
      svgIcon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.7 21a2 2 0 0 1-3.4 0"></path></svg>',
      link: '/home/notifications',
    },
    {
      id: 'chat',
      label: 'Tin nhắn',
      svgIcon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
      link: '/home/chat',
    },
    {
      id: 'reals-ai',
      label: 'Reals AI',
      svgIcon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
      link: '/home/reals-ai',
      badge: 'Mới',
      isAi: true,
    },
    {
      id: 'bookmarks',
      label: 'Đã lưu',
      svgIcon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a2 2 0 0 1 2 2v16l-8-5-8 5V5a2 2 0 0 1 2-2Z"></path></svg>',
      link: '/home/bookmarks',
    },
    {
      id: 'profile',
      label: 'Hồ sơ',
      svgIcon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3"></circle><path d="M5.5 20.5c1.5-2.5 4-4 6.5-4s5 1.5 6.5 4"></path></svg>',
      link: '/profile',
      exactMatch: true,
    },
  ];

  constructor() {
    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.displayName = user.displayName ?? '';
        this.username = user.username ?? '';
      }
    });
  }

  selectTab(tabId: ProfileTabId) {
    this.activeTab.set(tabId);
  }

  trackByTabId(index: number, tab: ProfileTab) {
    return tab.id;
  }
}

