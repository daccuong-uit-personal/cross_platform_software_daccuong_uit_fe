/**
 * @fileoverview Social domain models
 * Defines core data models for the social feature
 */

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  isFollowing: boolean;
  isFollowedBy: boolean;
  isBlocked: boolean;
  isMuted: boolean;
  joinedAt?: Date;
  website?: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  images: string[];
  video?: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount?: number;
  isLiked: boolean;
  isBookmarked: boolean;
  hashtags: string[];
  mentions: string[];
  privacy: PostPrivacy;
  isPinned: boolean;
  allowComments: boolean;
  location?: string;
}

export type PostPrivacy = 'public' | 'private' | 'friends';

export interface Comment {
  id: string;
  author: User;
  postId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  isLiked: boolean;
  replies: Comment[];
  mentionedUsers: string[];
}

export interface Notification {
  id: string;
  type: NotificationType;
  actor: User;
  targetId: string;
  targetType: NotificationTargetType;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedData?: Record<string, unknown>;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'tag' | 'message';
export type NotificationTargetType = 'post' | 'comment' | 'user' | 'message';

export interface Hashtag {
  tag: string;
  postsCount: number;
  trend: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  posts: Post[];
  createdAt: Date;
  isPublic: boolean;
  ownerId?: string;
}

export interface Feed {
  posts: Post[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface SearchResults {
  users: User[];
  posts: Post[];
  hashtags: Hashtag[];
}

export interface FollowRequest {
  id: string;
  from: User;
  to: User;
  createdAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface UserStatistics {
  userId: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesReceivedCount: number;
  engagementRate: number;
}

export interface CreatePostPayload {
  content: string;
  images?: File[];
  video?: File;
  hashtags?: string[];
  mentions?: string[];
  privacy: PostPrivacy;
  allowComments?: boolean;
  location?: string;
}

export interface UpdatePostPayload {
  content?: string;
  images?: string[];
  privacy?: PostPrivacy;
  allowComments?: boolean;
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
  mentionedUsers?: string[];
  replyToCommentId?: string;
}
