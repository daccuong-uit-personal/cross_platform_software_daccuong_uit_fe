import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';

@Component({
  selector: 'fe-friend-requests',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class FriendRequestsComponent {
  readonly mockUsers = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Thị Dung', 'Võ Minh Đức',
           'Đặng Thị Hoa', 'Bùi Quang Huy', 'Ngô Thị Kim', 'Hoàng Văn Long', 'Dương Thị Mai'][i],
    mutualFriends: Math.floor(Math.random() * 20) + 1,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Thị Dung', 'Võ Minh Đức', 'Đặng Thị Hoa', 'Bùi Quang Huy', 'Ngô Thị Kim', 'Hoàng Văn Long', 'Dương Thị Mai'][i])}&background=0D8ABC&color=fff&size=200`,
  }));
}
