import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';

const MOCK_NAMES = [
  'Bùi Văn Sáng', 'Nguyễn Thị Diệu', 'Trần Đình Lực', 'Đỗ Thị Huệ', 'Lê Quang Trung',
];

@Component({
  selector: 'fe-friend-muted',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './muted.component.html',
  styleUrls: ['./muted.component.css'],
})
export class FriendMutedComponent {
  readonly mockUsers = MOCK_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    subtitle: 'Đã tắt tiếng · Bài đăng sẽ không hiển thị trong feed của bạn',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6B7280&color=fff&size=100`,
  }));
}
