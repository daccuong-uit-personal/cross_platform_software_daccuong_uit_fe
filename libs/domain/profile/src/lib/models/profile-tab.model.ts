import type { Post } from '@fe/domain/social';

export type ProfileTabId = 'posts' | 'videos' | 'reels' | 'stories' | 'friends' | 'groups';

export interface ProfileTab {
  id: ProfileTabId;
  label: string;
}

export type ProfilePost = Post;

export interface ProfileFriend {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  mutualFriends: number;
  isOnline: boolean;
}

export interface ProfileGroup {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  isMember: boolean;
}
