import { Injectable, signal, inject } from '@angular/core';
import { SocialPostService, Post } from '@fe/domain/social';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeFacade {
  private readonly postService = inject(SocialPostService);

  private readonly _posts = signal<Post[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly posts = this._posts.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  loadFeed() {
    this._isLoading.set(true);
    this._error.set(null);
    this.postService.getFeed('personal').pipe(take(1)).subscribe({
      next: (feed) => {
        this._posts.set(feed.posts);
        this._isLoading.set(false);
      },
      error: (err) => {
        this._error.set(err.message || 'Lỗi tải trang');
        this._isLoading.set(false);
      }
    });
  }

  toggleLike(postId: string) {
    // Optimistic update
    this._posts.update(posts => posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1
        };
      }
      return p;
    }));

    // Call API
    this.postService.toggleLike(postId).pipe(take(1)).subscribe({
      next: () => {}, // Assuming successful
      error: () => {
        // Rollback on error
        this._posts.update(posts => posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1
            };
          }
          return p;
        }));
      }
    });
  }
}
