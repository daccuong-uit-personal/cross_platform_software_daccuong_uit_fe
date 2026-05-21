import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeShellComponent } from './components/home-shell/home-shell.component';
import { FeedComponent } from './components/feed/feed.component';
import { BottomMenuComponent } from './components/bottom-menu/bottom-menu.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { CreateComponent } from './components/create/create.component';
import { ActivityComponent } from './components/activity/activity.component';
import { FeaturePlaceholderComponent } from './components/feature-placeholder/feature-placeholder.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    FeedComponent,
    BottomMenuComponent,
    DiscoverComponent,
    CreateComponent,
    ActivityComponent,
    FeaturePlaceholderComponent,
    RightSidebarComponent,
    RouterModule.forChild([
      {
        path: '',
        component: HomeShellComponent,
        children: [
          { path: '', component: FeedComponent },
          { path: 'discover', component: DiscoverComponent },
          {
            path: 'notifications',
            component: FeaturePlaceholderComponent,
            data: {
              title: 'Thông báo',
              description: 'Xem tất cả cảnh báo và hoạt động của bạn.',
            },
          },
          {
            path: 'following',
            component: FeaturePlaceholderComponent,
            data: {
              title: 'Theo dõi',
              description: 'Danh sách người bạn đang theo dõi và gợi ý mới.',
            },
          },
          {
            path: 'chat',
            component: FeaturePlaceholderComponent,
            data: {
              title: 'Chat',
              description: 'Tin nhắn và cuộc trò chuyện trực tiếp.',
            },
          },
          {
            path: 'grok',
            component: FeaturePlaceholderComponent,
            data: {
              title: 'Grok',
              description: 'Trí tuệ nhân tạo cho nội dung và khám phá.',
            },
          },
          {
            path: 'bookmarks',
            component: FeaturePlaceholderComponent,
            data: {
              title: 'Dấu trang',
              description: 'Bài viết đã lưu để đọc lại sau.',
            },
          },
          {
            path: 'studio',
            component: FeaturePlaceholderComponent,
            data: {
              title: 'Studio người sáng tạo',
              description: 'Công cụ creator và thống kê nội dung.',
            },
          },
          {
            path: 'premium',
            component: FeaturePlaceholderComponent,
            data: {
              title: 'Premium',
              description: 'Nâng cấp gói để có trải nghiệm cao cấp.',
            },
          },
          {
            path: 'more',
            component: FeaturePlaceholderComponent,
            data: {
              title: 'Thêm',
              description: 'Các tùy chọn và cài đặt bổ sung.',
            },
          },
        ],
      },
    ]),
  ],
})
export class HomeModule {}
