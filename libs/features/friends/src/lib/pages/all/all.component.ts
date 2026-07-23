import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FriendsLayoutService } from '../../services/friends-layout.service';
import { CommonModule } from '@angular/common';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';

const MOCK_NAMES = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Thị Dung', 'Võ Minh Đức',
  'Đặng Thị Hoa', 'Bùi Quang Huy', 'Ngô Thị Kim', 'Hoàng Văn Long', 'Dương Thị Mai',
];

@Component({
  selector: 'fe-friend-all',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css'],
})
export class FriendAllComponent {
  readonly mockUsers = MOCK_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    subtitle: `Bạn bè từ ${['tháng 1', 'tháng 3', 'tháng 5', 'tháng 7', 'tháng 9', 'tháng 11', 'tháng 2', 'tháng 4', 'tháng 6', 'tháng 8'][i]} năm ${2020 + (i % 4)}`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=100`
  }));

  private layoutService = inject(FriendsLayoutService);

  selectFriend(user: any) {
    this.layoutService.selectFriend(user);
  }
}
