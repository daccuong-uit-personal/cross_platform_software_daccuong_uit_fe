import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';

const MOCK_NAMES = [
  'Trần Anh Tuấn', 'Nguyễn Thị Lan', 'Lê Văn Hải', 'Phạm Thị Nhung', 'Hoàng Minh Khoa',
  'Đỗ Thu Trang', 'Vũ Đình Sơn', 'Ngô Bích Phương', 'Bùi Thanh Tùng', 'Đinh Thị Hà',
];

@Component({
  selector: 'fe-friend-following',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
})
export class FriendFollowingComponent {
  readonly mockUsers = MOCK_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    subtitle: `Đang theo dõi · ${Math.floor(Math.random() * 500) + 10}K người theo dõi`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff&size=100`,
  }));
}
