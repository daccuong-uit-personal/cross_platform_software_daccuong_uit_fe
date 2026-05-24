import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface PlaceholderItem {
  icon: string;
  title: string;
  detail: string;
  cta?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'fe-feature-placeholder',
  templateUrl: './feature-placeholder.component.html',
  styleUrls: ['./feature-placeholder.component.css'],
})
export class FeaturePlaceholderComponent {
  title!: string;
  description!: string;
  icon = '';
  items: PlaceholderItem[] = [];

  constructor(private route: ActivatedRoute) {
    this.title = this.route.snapshot.data['title'] || 'Page';
    this.description = this.route.snapshot.data['description'] || 'This page is a placeholder for future features.';
    this.icon = this.getIcon();
    this.items = this.getItems();
  }

  private getIcon(): string {
    const path = this.route.snapshot.routeConfig?.path || '';

    switch (path) {
      case 'notifications':
        return '🔔';
      case 'chat':
        return '💬';
      case 'studio':
        return '🎬';
      case 'grok':
        return '🧠';
      default:
        return '⚙️';
    }
  }

  private getItems(): PlaceholderItem[] {
    const path = this.route.snapshot.routeConfig?.path || '';

    if (path === 'notifications') {
      return [
        {
          icon: '📝',
          title: 'Nhắc nhở mới',
          detail: 'Bình luận mới, lượt thích và đề cập chờ bạn xác nhận.',
          cta: 'Xem tất cả',
        },
        {
          icon: '🔔',
          title: 'Thông báo hệ thống',
          detail: 'Cập nhật nền tảng, thông báo giới hạn thời gian và ưu đãi.',
          cta: 'Kiểm tra',
        },
      ];
    }

    if (path === 'chat') {
      return [
        {
          icon: '👤',
          title: 'Tin nhắn mới',
          detail: 'Bạn có 3 cuộc trò chuyện chưa đọc với creator và người hâm mộ.',
          cta: 'Mở Chat',
        },
        {
          icon: '📨',
          title: 'Hộp thư đến',
          detail: 'Trả lời nhanh các tin nhắn quan trọng ngay trong trang này.',
          cta: 'Xem ngay',
        },
      ];
    }

    if (path === 'studio') {
      return [
        {
          icon: '📊',
          title: 'Phân tích nội dung',
          detail: 'Xem hiệu suất bài đăng, tỷ lệ tương tác và lượt xem trong thời gian thực.',
          cta: 'Mở Studio',
        },
        {
          icon: '⚙️',
          title: 'Công cụ sáng tạo',
          detail: 'Thiết lập chiến dịch, quản lý nội dung và tối ưu hóa định dạng.',
          cta: 'Bắt đầu',
        },
      ];
    }

    return [
      {
        icon: '📌',
        title: 'Tính năng sắp tới',
        detail: 'Chúng tôi đang xây dựng giao diện đầy đủ và tiện ích hơn cho bạn.',
        cta: 'Theo dõi tiến độ',
      },
    ];
  }
}
