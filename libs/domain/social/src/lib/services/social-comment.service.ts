/**
 * @fileoverview Comment service - handles comment operations
 * PHASE 5: Uses mock data. Replace with actual API service in Phase 5B.
 */

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Comment, CreateCommentPayload } from '../models';
import { MOCK_COMMENTS } from '../mocks/mock-data';

@Injectable({
  providedIn: 'root',
})
export class SocialCommentService {
  private comments = { ...MOCK_COMMENTS };

  /**
   * Get comments for a post
   */
  getComments(postId: string): Observable<Comment[]> {
    const postComments = this.comments[postId] || [];
    return of(postComments).pipe(delay(400));
  }

  /**
   * Get a single comment
   */
  getComment(commentId: string): Observable<Comment | null> {
    // Flat search through all comments and their replies
    let found: Comment | null = null;

    Object.values(this.comments).forEach((comments) => {
      const search = (items: Comment[]): Comment | null => {
        for (const comment of items) {
          if (comment.id === commentId) {
            return comment;
          }
          const reply = search(comment.replies);
          if (reply) {
            return reply;
          }
        }
        return null;
      };

      if (!found) {
        found = search(comments);
      }
    });

    return of(found).pipe(delay(300));
  }

  /**
   * Create a new comment
   */
  createComment(payload: CreateCommentPayload): Observable<Comment> {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        id: 'user-001',
        username: 'duc_dai',
        fullName: 'Đức Đại',
        avatar: 'https://i.pravatar.cc/150?img=12',
        bio: '🚀 Full-stack dev',
        followers: 1250,
        following: 340,
        postsCount: 43,
        isFollowing: false,
        isFollowedBy: false,
        isBlocked: false,
        isMuted: false,
      },
      postId: payload.postId,
      content: payload.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      likesCount: 0,
      isLiked: false,
      replies: [],
      mentionedUsers: payload.mentionedUsers || [],
    };

    // Add to main comments or as a reply
    if (payload.replyToCommentId) {
      this.addReply(payload.replyToCommentId, newComment);
    } else {
      if (!this.comments[payload.postId]) {
        this.comments[payload.postId] = [];
      }
      this.comments[payload.postId].push(newComment);
    }

    return of(newComment).pipe(delay(600));
  }

  /**
   * Add a reply to a comment
   */
  private addReply(parentCommentId: string, reply: Comment): void {
    Object.values(this.comments).forEach((comments) => {
      const findAndAddReply = (items: Comment[]): boolean => {
        for (const comment of items) {
          if (comment.id === parentCommentId) {
            comment.replies.push(reply);
            return true;
          }
          if (findAndAddReply(comment.replies)) {
            return true;
          }
        }
        return false;
      };

      findAndAddReply(comments);
    });
  }

  /**
   * Update a comment
   */
  updateComment(commentId: string, content: string): Observable<Comment> {
    let updated: Comment | null = null;

    const findAndUpdate = (items: Comment[]): boolean => {
      for (const comment of items) {
        if (comment.id === commentId) {
          comment.content = content;
          comment.updatedAt = new Date();
          updated = comment;
          return true;
        }
        if (findAndUpdate(comment.replies)) {
          return true;
        }
      }
      return false;
    };

    Object.values(this.comments).forEach((comments) => {
      if (!updated) {
        findAndUpdate(comments);
      }
    });

    if (!updated) {
      return throwError(() => new Error('Comment not found'));
    }

    return of(updated as Comment).pipe(delay(500));
  }

  /**
   * Delete a comment
   */
  deleteComment(commentId: string): Observable<void> {
    let deleted = false;

    const findAndDelete = (items: Comment[]): boolean => {
      const index = items.findIndex((c) => c.id === commentId);
      if (index !== -1) {
        items.splice(index, 1);
        return true;
      }

      for (const comment of items) {
        if (findAndDelete(comment.replies)) {
          return true;
        }
      }

      return false;
    };

    Object.values(this.comments).forEach((comments) => {
      if (!deleted) {
        deleted = findAndDelete(comments);
      }
    });

    if (!deleted) {
      return throwError(() => new Error('Comment not found'));
    }

    return of(undefined).pipe(delay(400));
  }

  /**
   * Like/Unlike a comment
   */
  toggleCommentLike(commentId: string): Observable<boolean> {
    const comments = Object.values(this.comments).flat();
    const queue: Comment[] = [...comments];
    let commentToUpdate: Comment | null = null;

    while (queue.length > 0 && !commentToUpdate) {
      const current = queue.shift()!;
      if (current.id === commentId) {
        commentToUpdate = current;
      } else {
        queue.push(...current.replies);
      }
    }

    if (!commentToUpdate) {
      return throwError(() => new Error('Comment not found'));
    }

    commentToUpdate.isLiked = !commentToUpdate.isLiked;
    commentToUpdate.likesCount += commentToUpdate.isLiked ? 1 : -1;

    return of(commentToUpdate.isLiked).pipe(delay(350));
  }

  /**
   * Get replies for a comment
   */
  getReplies(commentId: string): Observable<Comment[]> {
    let replies: Comment[] = [];

    const findReplies = (items: Comment[]): boolean => {
      for (const comment of items) {
        if (comment.id === commentId) {
          replies = comment.replies;
          return true;
        }
        if (findReplies(comment.replies)) {
          return true;
        }
      }
      return false;
    };

    Object.values(this.comments).forEach((comments) => {
      if (replies.length === 0) {
        findReplies(comments);
      }
    });

    return of(replies).pipe(delay(300));
  }
}
