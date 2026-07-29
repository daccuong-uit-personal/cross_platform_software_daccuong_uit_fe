import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendCardComponent, FriendCardActionEvent } from '../../components/friend-card/friend-card.component';
import { FriendsApiService, FriendUser } from '../../services/friends-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'fe-friend-blocked',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './blocked.component.html',
  styleUrls: ['./blocked.component.css'],
})
export class FriendBlockedComponent {
  private friendsApi = inject(FriendsApiService);
  private readonly refreshTrigger = new BehaviorSubject<void>(undefined);

  readonly users = toSignal(
    this.refreshTrigger.pipe(switchMap(() => this.friendsApi.getBlockedUsers(1, 20))),
    { initialValue: [] }
  );

  onAction(event: FriendCardActionEvent) {
    const currentUser = event.user as FriendUser;
    if (event.type === 'unblock') {
      this.friendsApi.unblockUser(currentUser.id).subscribe();
    }
  }

  private refresh() {
    this.refreshTrigger.next();
  }
}
