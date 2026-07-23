import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';

const MOCK_NAMES = [
  'Nguyễn Hoàng Nam', 'Trịnh Thị Bảo', 'Phùng Văn Đức', 'Vương Thị Hà', 'Mạc Đình Tuấn',
  'Thái Thị Hồng', 'Đinh Văn Phát', 'Lê Thị Vy', 'Hà Quang Minh', 'Chu Thị Lan',
];

@Component({
  selector: 'fe-friend-sent',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.css'],
})
export class FriendSentComponent {
  readonly mockUsers = MOCK_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    mutualFriends: Math.floor(Math.random() * 15) + 1,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D97706&color=fff&size=200`,
  }));
}
