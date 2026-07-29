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
  private localState: 'pending' | 'suggested' | 'following' | 'blocked' | 'muted' | 'friends' | 'default' = 'default';
  private localFriendState: 'friend' | 'not-friend' | 'default' = 'default';

  getStateLabel(): string {
    switch (this.context) {
      case 'sent':
        return this.getVisibleSuggestionState() === 'pending' ? 'Đã gửi lời mời' : 'Chưa gửi lời mời';
      case 'suggestions':
        return this.getVisibleSuggestionState() === 'pending' ? 'Đã gửi lời mời' : 'Gợi ý kết bạn';
      case 'requests':
        return 'Đang chờ xác nhận';
      case 'all':
        return 'Bạn bè';
      case 'relationships':
        return this.getRelationshipLabel();
      case 'followers':
        return 'Theo dõi bạn';
      case 'following':
        return this.getVisibleFollowState() === 'following' ? 'Đang theo dõi' : 'Chưa theo dõi';
      case 'blocked':
        return this.getVisibleBlockState() === 'blocked' ? 'Đã chặn' : 'Chưa chặn';
      case 'muted':
        return 'Đã mute';
      default:
        return 'Mối quan hệ';
    }
  }

  getPrimaryActionLabel(): string {
    if (this.context === 'suggestions') {
      return this.getVisibleSuggestionState() === 'pending' ? 'Đã gửi kết bạn' : 'Kết bạn';
    }

    if (this.context === 'following') {
      return this.getVisibleFollowState() === 'following' ? 'Bỏ theo dõi' : 'Theo dõi';
    }

    if (this.context === 'blocked') {
      return this.getVisibleBlockState() === 'blocked' ? 'Bỏ chặn' : 'Chặn';
    }

    switch (this.context) {
      case 'sent':
        return 'Huỷ lời mời';
      case 'requests':
        return 'Xác nhận';
      case 'all':
        return 'Bạn bè';
      case 'relationships':
        return 'Quan hệ';
      case 'muted':
        return 'Đã mute';
      default:
        return 'Thao tác';
    }
  }

  getVisibleSuggestionState(): 'pending' | 'suggested' {
    if (this.localState === 'pending' || this.localState === 'suggested') {
      return this.localState;
    }

    return this.user?.status === 'pending' ? 'pending' : 'suggested';
  }

  getVisibleFollowState(): 'following' | 'not-following' {
    if (this.localState === 'following') {
      return 'following';
    }

    return this.user?.status === 'following' ? 'following' : 'not-following';
  }

  getVisibleBlockState(): 'blocked' | 'not-blocked' {
    if (this.localState === 'blocked') {
      return 'blocked';
    }

    return this.user?.status === 'blocked' ? 'blocked' : 'not-blocked';
  }

  getVisibleFriendState(): 'friend' | 'not-friend' {
    if (this.localFriendState === 'friend' || this.localFriendState === 'not-friend') {
      return this.localFriendState;
    }

    return this.user?.status === 'friend' ? 'friend' : 'not-friend';
  }

  getSuggestionButtonClass(): string {
    return this.getVisibleSuggestionState() === 'pending' ? 'btn-outline state-pending' : 'btn-primary state-suggested';
  }

  getFollowButtonClass(): string {
    return this.getVisibleFollowState() === 'following' ? 'state-following' : 'state-default';
  }

  getFriendMenuLabel(): string {
    return this.getVisibleFriendState() === 'friend' ? 'Huỷ kết bạn' : 'Kết bạn';
  }

  getFollowMenuLabel(): string {
    return this.getVisibleFollowState() === 'following' ? 'Bỏ theo dõi' : 'Theo dõi';
  }

  getBlockButtonClass(): string {
    return this.getVisibleBlockState() === 'blocked' ? 'state-blocked' : 'state-default';
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

    if (type === 'send-request') {
      this.localState = 'pending';
      this.localFriendState = 'not-friend';
      this.user.status = 'pending';
    }

    if (type === 'cancel-request') {
      this.localState = 'suggested';
      this.user.status = 'suggested';
    }

    if (type === 'unfollow') {
      this.localState = 'default';
      this.user.status = 'not-following';
    }

    if (type === 'follow') {
      this.localState = 'following';
      this.user.status = 'following';
    }

    if (type === 'unfriend') {
      this.localFriendState = 'not-friend';
      this.user.status = 'not-friend';
    }

    if (type === 'block') {
      this.localState = 'blocked';
      this.user.status = 'blocked';
    }

    if (type === 'unblock') {
      this.localState = 'default';
      this.user.status = 'not-blocked';
    }

    this.actionRequested.emit({ type, user: this.user, relationshipType });
  }

  toggleMenu(name: string, ev?: Event) {
    ev?.stopPropagation();
    this.openMenu = this.openMenu === name ? undefined : name;
  }
}
