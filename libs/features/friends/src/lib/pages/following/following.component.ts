import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendCardComponent, FriendCardActionEvent } from '../../components/friend-card/friend-card.component';
import { FriendsApiService, FriendUser } from '../../services/friends-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'fe-friend-following',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
})
export class FriendFollowingComponent {
  private friendsApi = inject(FriendsApiService);
  private readonly refreshTrigger = new BehaviorSubject<void>(undefined);

  readonly users = toSignal(
    this.refreshTrigger.pipe(switchMap(() => this.friendsApi.getFollowing(1, 20))),
    { initialValue: [] }
  );

  onAction(event: FriendCardActionEvent) {
    const currentUser = event.user as FriendUser;
    if (event.type === 'unfollow') {
      this.friendsApi.unfollowUser(currentUser.id).subscribe(() => this.refresh());
    }
  }

  private refresh() {
    this.refreshTrigger.next();
  }
}
