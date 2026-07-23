import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';

const MOCK_NAMES = [
  'Lý Thị Cẩm', 'Trương Văn Đạt', 'Phan Thị Ngọc', 'Hồ Quốc Bảo', 'Tống Thị Linh',
  'Cao Đình Phúc', 'Lâm Thị Yến', 'Tạ Văn Kiên', 'Nghiêm Thị Thảo', 'Dư Văn Tuấn',
];

@Component({
  selector: 'fe-friend-followers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css'],
})
export class FriendFollowersComponent {
  readonly mockUsers = MOCK_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    subtitle: `Theo dõi bạn · ${Math.floor(Math.random() * 200) + 5}K người theo dõi`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=DC2626&color=fff&size=100`,
  }));
}
