/**
 * @fileoverview Social service - handles post operations
 * PHASE 5: Uses mock data. Replace with actual API service in Phase 5B.
 */

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Post, CreatePostPayload, UpdatePostPayload, Feed } from '../models';
import { MOCK_POSTS } from '../mocks/mock-data';

@Injectable({
  providedIn: 'root',
})
export class SocialPostService {
  private posts = [...MOCK_POSTS];

  /**
   * Get feed posts (personal feed or discover)
   * @param type 'personal' | 'discover'
   * @param cursor pagination cursor
   */
  getFeed(type: 'personal' | 'discover' = 'personal', cursor?: string): Observable<Feed> {
    // Simulate pagination and API delay
    return of({
      posts: this.posts,
      hasMore: false,
      nextCursor: undefined,
    }).pipe(delay(500));
  }

  /**
   * Get a single post by ID
   */
  getPost(postId: string): Observable<Post | null> {
    const post = this.posts.find((p) => p.id === postId);
    return of(post || null).pipe(delay(300));
  }

  /**
   * Create a new post
   */
  createPost(payload: CreatePostPayload): Observable<Post> {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        id: 'user-001',
        username: 'duc_dai',
        fullName: 'Đức Đại',
        avatar: 'https://i.pravatar.cc/150?img=12',
        bio: '🚀 Full-stack dev | Coffee ☕ | Tech enthusiast',
        followers: 1250,
        following: 340,
        postsCount: 43,
        isFollowing: false,
        isFollowedBy: false,
        isBlocked: false,
        isMuted: false,
      },
      content: payload.content,
      images: payload.images ? payload.images.map(() => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400') : [],
      video: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 0,
      isLiked: false,
      isBookmarked: false,
      hashtags: payload.hashtags || [],
      mentions: payload.mentions || [],
      privacy: payload.privacy,
      isPinned: false,
      allowComments: payload.allowComments !== false,
      location: payload.location,
    };

    this.posts.unshift(newPost);
    return of(newPost).pipe(delay(800));
  }

  /**
   * Update a post
   */
  updatePost(postId: string, payload: UpdatePostPayload): Observable<Post> {
    const postIndex = this.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return throwError(() => new Error('Post not found'));
    }

    const post = this.posts[postIndex];
    const updatedPost: Post = {
      ...post,
      ...payload,
      updatedAt: new Date(),
    };

    this.posts[postIndex] = updatedPost;
    return of(updatedPost).pipe(delay(600));
  }

  /**
   * Delete a post
   */
  deletePost(postId: string): Observable<void> {
    const postIndex = this.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return throwError(() => new Error('Post not found'));
    }

    this.posts.splice(postIndex, 1);
    return of(undefined).pipe(delay(500));
  }

  /**
   * Like/Unlike a post
   */
  toggleLike(postId: string): Observable<boolean> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) {
      return throwError(() => new Error('Post not found'));
    }

    const wasLiked = post.isLiked;
    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;

    return of(post.isLiked).pipe(delay(400));
  }

  /**
   * Bookmark/Remove bookmark
   */
  toggleBookmark(postId: string): Observable<boolean> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) {
      return throwError(() => new Error('Post not found'));
    }

    post.isBookmarked = !post.isBookmarked;
    return of(post.isBookmarked).pipe(delay(300));
  }

  /**
   * Share a post (repost)
   */
  sharePost(postId: string): Observable<void> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) {
      return throwError(() => new Error('Post not found'));
    }

    post.sharesCount += 1;
    return of(undefined).pipe(delay(400));
  }

  /**
   * Get posts by hashtag
   */
  getPostsByHashtag(hashtag: string): Observable<Post[]> {
    const filtered = this.posts.filter((p) =>
      p.hashtags.some((h) => h.toLowerCase() === hashtag.toLowerCase())
    );
    return of(filtered).pipe(delay(500));
  }

  /**
   * Get user's posts
   */
  getUserPosts(userId: string): Observable<Post[]> {
    const filtered = this.posts.filter((p) => p.author.id === userId);
    return of(filtered).pipe(delay(400));
  }

  /**
   * Get bookmarked posts
   */
  getBookmarkedPosts(): Observable<Post[]> {
    const bookmarked = this.posts.filter((p) => p.isBookmarked);
    return of(bookmarked).pipe(delay(500));
  }
}
