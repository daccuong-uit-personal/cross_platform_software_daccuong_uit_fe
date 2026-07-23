import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';

const MOCK_NAMES = [
  'Kiều Minh Đạt', 'Trần Thị Bảo Châu', 'Phan Đình Phong', 'Lưu Thị Ngân', 'Hứa Văn Thịnh',
  'Mã Thị Duyên', 'Nông Văn Khánh', 'Liêu Thị Phương', 'Đàm Quốc Bình', 'Tô Thị Tuyền',
];

@Component({
  selector: 'fe-friend-relationships',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './relationships.component.html',
  styleUrls: ['./relationships.component.css'],
})
export class FriendRelationshipsComponent {
  readonly mockUsers = MOCK_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    mutualFriends: Math.floor(Math.random() * 25) + 2,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7C3AED&color=fff&size=200`,
  }));
}
