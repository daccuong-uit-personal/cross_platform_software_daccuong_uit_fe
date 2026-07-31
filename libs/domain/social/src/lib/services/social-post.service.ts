/**
 * @fileoverview Social service - handles post operations via real API
 */

import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Post, CreatePostPayload, UpdatePostPayload, Feed } from '../models';
import { ApiService, appConfig } from '@fe/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SocialPostService {
  private api = inject(ApiService);
  private http = inject(HttpClient);
  private readonly apiUrl = appConfig.apiUrl;

  /** Map raw backend post to FE Post model */
  private mapPost(raw: any): Post {
    const author = raw.author ?? {};
    return {
      id: raw.id,
      author: {
        id: author.id ?? author.userId ?? '',
        username: author.username ?? '',
        fullName: author.displayName ?? author.fullName ?? author.username ?? '',
        avatar: author.avatarUrl ?? author.avatar ?? '',
        bio: author.bio ?? '',
        followers: author.followersCount ?? 0,
        following: author.followingCount ?? 0,
        postsCount: author.postCount ?? 0,
        isFollowing: author.isFollowing ?? false,
        isFollowedBy: author.isFollowedBy ?? false,
        isBlocked: false,
        isMuted: false,
      },
      content: raw.content ?? '',
      images: raw.mediaUrls ?? [],
      video: undefined,
      createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
      likesCount: raw.likeCount ?? raw.likesCount ?? 0,
      commentsCount: raw.commentCount ?? raw.commentsCount ?? 0,
      sharesCount: raw.shareCount ?? raw.sharesCount ?? 0,
      viewsCount: raw.viewCount ?? raw.viewsCount ?? 0,
      isLiked: raw.isLikedByCurrentUser ?? raw.isLiked ?? false,
      isBookmarked: raw.isBookmarkedByCurrentUser ?? raw.isBookmarked ?? false,
      hashtags: raw.hashtags ?? [],
      mentions: raw.mentions ?? [],
      privacy: (raw.visibility ?? 'public') as any,
      isPinned: raw.isPinned ?? false,
      allowComments: raw.allowComments !== false,
      location: raw.location,
    };
  }

  /**
   * Get feed posts (personal feed or discover)
   */
  getFeed(type: 'personal' | 'discover' = 'personal', page = 1): Observable<Feed> {
    const endpoint = type === 'personal' ? '/feed' : '/discover';
    return this.api.get<any>(endpoint, { params: { page, pageSize: 20 } }).pipe(
      map(res => {
        // Backend trả về { statusCode, data: [], meta: { pagination } }
        const rawPosts: any[] = Array.isArray(res)
          ? res
          : Array.isArray(res.data)
            ? res.data
            : [];
        const pagination = res.meta?.pagination ?? {};
        return {
          posts: rawPosts.map(p => this.mapPost(p)),
          hasMore: pagination.hasNext ?? false,
          nextCursor: pagination.currentPage ? String(pagination.currentPage + 1) : undefined,
        };
      }),
      catchError(err => {
        console.error('[SocialPostService] getFeed error:', err);
        return of({ posts: [], hasMore: false });
      })
    );
  }

  /**
   * Get a single post by ID
   */
  getPost(postId: string): Observable<Post | null> {
    return this.api.get<any>(`/posts/${postId}`).pipe(
      map(res => this.mapPost(res)),
      catchError(() => of(null))
    );
  }

  /**
   * Create a new post - upload media first, then create post
   */
  createPost(payload: CreatePostPayload): Observable<Post> {
    const uploadTasks: Observable<string>[] = [];

    if (payload.images && payload.images.length > 0) {
      for (const file of payload.images) {
        const formData = new FormData();
        formData.append('file', file);
        const upload$ = this.http
          .post<{ data: { id: string; fileName: string; originalName: string } }>(
            `${this.apiUrl}/media/upload`,
            formData
          )
          .pipe(
            map(res => `${this.apiUrl}/media/${res.data.id}/file`)
          );
        uploadTasks.push(upload$);
      }
    }

    const buildDto = (mediaUrls: string[] = []) => ({
      content: payload.content,
      type: mediaUrls.length > 1 ? 'gallery' : mediaUrls.length === 1 ? 'image' : 'text',
      mediaUrls,
      visibility: payload.privacy ?? 'public',
      location: payload.location,
    });

    if (uploadTasks.length > 0) {
      return forkJoin(uploadTasks).pipe(
        switchMap(mediaUrls =>
          this.api.post<any>('/posts', buildDto(mediaUrls))
        ),
        map(res => this.mapPost(res))
      );
    }

    return this.api.post<any>('/posts', buildDto()).pipe(
      map(res => this.mapPost(res))
    );
  }

  /**
   * Update a post
   */
  updatePost(postId: string, payload: UpdatePostPayload): Observable<Post> {
    return this.api.put<any>(`/posts/${postId}`, payload).pipe(
      map(res => this.mapPost(res))
    );
  }

  /**
   * Delete a post
   */
  deletePost(postId: string): Observable<void> {
    return this.api.delete<void>(`/posts/${postId}`);
  }

  /**
   * Like a post (use isLiked to decide like vs unlike)
   */
  toggleLike(postId: string, currentlyLiked = false): Observable<boolean> {
    if (currentlyLiked) {
      return this.api.delete<any>(`/posts/${postId}/like`).pipe(
        map(() => false),
        catchError(() => of(false))
      );
    }
    return this.api.post<any>(`/posts/${postId}/like`).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }

  /**
   * Share a post
   */
  sharePost(postId: string): Observable<void> {
    return this.api.post<void>(`/posts/${postId}/share`);
  }

  /**
   * Get posts by hashtag
   */
  getPostsByHashtag(hashtag: string): Observable<Post[]> {
    return this.api.get<any>(`/posts`, { params: { hashtag } }).pipe(
      map(res => (Array.isArray(res.data) ? res.data : []).map((p: any) => this.mapPost(p)))
    );
  }

  /**
   * Get user's posts
   */
  getUserPosts(userId: string): Observable<Post[]> {
    return this.api.get<any>(`/posts`, { params: { authorId: userId } }).pipe(
      map(res => (Array.isArray(res.data) ? res.data : []).map((p: any) => this.mapPost(p)))
    );
  }
}
