import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { FriendsLayoutService } from '../../services/friends-layout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fe-friend-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './friend-card.component.html',
  styleUrls: ['./friend-card.component.css'],
})
export class FriendCardComponent {
  @Input() variant: 'avatar-card' | 'list-row' = 'avatar-card';
  @Input() user: any;
  @Input() context?: 'all' | 'sent' | 'suggestions' | 'relationships' | 'followers' | 'muted' | 'requests' | 'following' | 'blocked';
  private layoutService = inject(FriendsLayoutService);
  // control which floating menu is open for this card (by name)
  openMenu?: string;


  onSelect() {
    if (this.user) {
      this.layoutService.selectFriend(this.user);
    }
  }

  toggleMenu(name: string, ev?: Event) {
    ev?.stopPropagation();
    this.openMenu = this.openMenu === name ? undefined : name;
  }
}
