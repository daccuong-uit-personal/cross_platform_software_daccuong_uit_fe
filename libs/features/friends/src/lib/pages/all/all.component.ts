import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FriendsLayoutService } from '../../services/friends-layout.service';
import { CommonModule } from '@angular/common';
import { FriendCardComponent, FriendCardActionEvent } from '../../components/friend-card/friend-card.component';
import { FriendsApiService, FriendUser } from '../../services/friends-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'fe-friend-all',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css'],
})
export class FriendAllComponent {
  private layoutService = inject(FriendsLayoutService);
  private friendsApi = inject(FriendsApiService);
  private readonly refreshTrigger = new BehaviorSubject<void>(undefined);

  readonly users = toSignal(
    this.refreshTrigger.pipe(switchMap(() => this.friendsApi.getFriends(1, 20))),
    { initialValue: [] }
  );

  selectFriend(user: FriendUser) {
    this.layoutService.selectFriend(user);
  }

  onAction(event: FriendCardActionEvent) {
    const currentUser = event.user as FriendUser;
    if (event.type === 'unfriend') {
      this.friendsApi.unfriend(currentUser.id).subscribe();
    }
    if (event.type === 'send-request') {
      this.friendsApi.sendFriendRequest(currentUser.id).subscribe();
    }
    if (event.type === 'follow') {
      this.friendsApi.followUser(currentUser.id).subscribe();
    }
    if (event.type === 'unfollow') {
      this.friendsApi.unfollowUser(currentUser.id).subscribe();
    }
    if (event.type === 'update-relationship') {
      this.friendsApi.updateRelationship(currentUser.id, event.relationshipType ?? 'NORMAL').subscribe();
    }
  }

  private refresh() {
    this.refreshTrigger.next();
  }
}
