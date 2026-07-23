import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';

const MOCK_NAMES = [
  'Minh Tuấn', 'Thu Hương', 'Hoàng Nam', 'Lan Anh', 'Đức Thành',
  'Ngọc Mai', 'Bảo Châu', 'Quang Hưng', 'Kim Oanh', 'Việt Hùng',
];

@Component({
  selector: 'fe-friend-suggestions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css'],
})
export class FriendSuggestionsComponent {
  readonly mockUsers = MOCK_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    mutualFriends: Math.floor(Math.random() * 30) + 1,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7C3AED&color=fff&size=200`,
  }));
}
