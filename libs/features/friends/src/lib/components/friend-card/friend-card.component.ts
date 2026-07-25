import { Component, Input, ChangeDetectionStrategy, inject, Output, EventEmitter } from '@angular/core';
import { FriendsLayoutService } from '../../services/friends-layout.service';
import { CommonModule } from '@angular/common';
import { FriendUser } from '../../services/friends-api.service';

export interface FriendCardActionEvent {
  type: string;
  user: FriendUser;
  relationshipType?: string;
}

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
  @Input() user!: FriendUser;
  @Input() context?: 'all' | 'sent' | 'suggestions' | 'relationships' | 'followers' | 'muted' | 'requests' | 'following' | 'blocked';
  @Output() actionRequested = new EventEmitter<FriendCardActionEvent>();
  private layoutService = inject(FriendsLayoutService);
  // control which floating menu is open for this card (by name)
  openMenu?: string;

  getStateLabel(): string {
    switch (this.context) {
      case 'sent':
        return this.user?.status === 'pending' ? 'Đã gửi lời mời' : 'Chưa gửi lời mời';
      case 'suggestions':
        return this.user?.status === 'pending' ? 'Đã gửi lời mời' : 'Gợi ý kết bạn';
      case 'requests':
        return 'Đang chờ xác nhận';
      case 'all':
        return 'Bạn bè';
      case 'relationships':
        return this.getRelationshipLabel();
      case 'followers':
        return 'Theo dõi bạn';
      case 'following':
        return 'Đang theo dõi';
      case 'blocked':
        return 'Đã chặn';
      case 'muted':
        return 'Đã mute';
      default:
        return 'Mối quan hệ';
    }
  }

  getPrimaryActionLabel(): string {
    switch (this.context) {
      case 'sent':
        return 'Huỷ lời mời';
      case 'suggestions':
        return this.user?.status === 'pending' ? 'Đã gửi kết bạn' : 'Kết bạn';
      case 'requests':
        return 'Xác nhận';
      case 'all':
        return 'Bạn bè';
      case 'relationships':
        return 'Quan hệ';
      case 'following':
        return 'Đang theo dõi';
      case 'blocked':
        return 'Đã chặn';
      case 'muted':
        return 'Đã mute';
      default:
        return 'Thao tác';
    }
  }

  private getRelationshipLabel(): string {
    switch (this.user?.relationshipType) {
      case 'SIBLING':
        return 'Anh/Chị/Em';
      case 'CLOSE_FRIEND':
        return 'Thân thiết';
      case 'LOVER':
        return 'Người yêu';
      case 'MARRIED':
        return 'Vợ/Chồng';
      case 'FAVORITE':
        return 'Yêu thích';
      default:
        return 'Bạn bè';
    }
  }

  onSelect() {
    if (this.user) {
      this.layoutService.selectFriend(this.user);
    }
  }

  emitAction(type: string, ev?: Event, relationshipType?: string) {
    ev?.stopPropagation();
    this.actionRequested.emit({ type, user: this.user, relationshipType });
  }

  toggleMenu(name: string, ev?: Event) {
    ev?.stopPropagation();
    this.openMenu = this.openMenu === name ? undefined : name;
  }
}
