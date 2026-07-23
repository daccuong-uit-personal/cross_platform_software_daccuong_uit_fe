import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
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
  GLOBAL_MENU_ITEMS,
  UiTabsComponent,
  UiTab
} from '@fe/ui';
import { ProfileRightSidebarComponent } from '../components/profile-right-sidebar/profile-right-sidebar.component';
import {
  ProfileTab,
  ProfileTabId,
  ProfilePost,
  ProfileFriend,
  ProfileGroup,
} from '@fe/domain/profile';
import { ProfileFacade } from '../data-access/profile.facade';

@Component({
  standalone: true,
  selector: 'feat-profile-page',
  imports: [CommonModule, RouterModule, PageShellComponent, ProfileRightSidebarComponent, UiButton, PostCardComponent, ProfileFriendCardComponent, ProfileGroupCardComponent, UiTabsComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private profileFacade = inject(ProfileFacade);

  profileData = this.profileFacade.profile;

  displayName = computed(() => this.profileData()?.displayName ?? '');
  username = computed(() => this.profileData()?.username ?? '');
  bio = computed(() => this.profileData()?.bio ?? '');
  avatarUrl = computed(() => this.profileData()?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.displayName() || this.username() || 'User')}&background=333&color=fff`);
  coverUrl = computed(() => this.profileData()?.coverUrl || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18');
  isVerified = computed(() => this.profileData()?.isVerified ?? false);
  profileHandle = computed(() => this.username() ? `@${this.username()}` : '@người_dùng');

  stats = this.profileFacade.stats;
  followingCount = computed(() => this.stats()?.followingCount ?? 0);
  followersCount = computed(() => this.stats()?.followersCount ?? 0);
  postsCount = computed(() => this.stats()?.postsCount ?? 0);

  tabs = computed<ProfileTab[]>(() =>
    this.profileFacade.tabs().map((tab) => ({
      id: tab.id as ProfileTabId,
      label: tab.label,
    }))
  );
  
  uiTabs = computed<UiTab[]>(() => 
    this.tabs().map(tab => ({
      id: tab.id,
      label: tab.label
    }))
  );

  activeTab = signal<ProfileTabId>('posts');
  activeTabLabel = computed(() => this.tabs().find((tab) => tab.id === this.activeTab())?.label ?? '');

  posts = this.profileFacade.posts;
  friends = this.profileFacade.friends;
  groups = this.profileFacade.groups;
  
  // Expose tab data to check if empty
  tabData = this.profileFacade.tabData;
  isTabEmpty = computed(() => {
    const data = this.tabData();
    if (!data) return false;
    return !data.data || data.data.length === 0;
  });

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

  menuItems: SidebarMenuItem[] = GLOBAL_MENU_ITEMS;

  constructor() {
    effect(() => {
      const user = this.authService.user();
      const userId = user?.userId;
      if (userId) {
        untracked(() => {
          this.profileFacade.loadProfile(userId);
          this.profileFacade.loadProfileTabData(userId, this.activeTab());
        });
      }
    }, { allowSignalWrites: true });
  }

  selectTab(tabId: ProfileTabId) {
    this.activeTab.set(tabId);
    const user = this.authService.user();
    const userId = user?.userId;
    if (userId) {
      this.profileFacade.loadProfileTabData(userId, tabId);
    }
  }

  onTabChange(tab: UiTab) {
    this.selectTab(tab.id as ProfileTabId);
  }

  trackByTabId(index: number, tab: ProfileTab) {
    return tab.id;
  }
}
