import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';

const MOCK_NAMES = [
  'Ngô Văn Chiến', 'Đặng Thị Thủy', 'Lưu Đình Hiệp', 'Đoàn Thị Ngọc Bích', 'Trần Tuấn Kiệt',
];

@Component({
  selector: 'fe-friend-blocked',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './blocked.component.html',
  styleUrls: ['./blocked.component.css'],
})
export class FriendBlockedComponent {
  readonly mockUsers = MOCK_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    subtitle: 'Đã chặn · Không thể xem trang cá nhân của bạn',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6B7280&color=fff&size=100`,
  }));
}
