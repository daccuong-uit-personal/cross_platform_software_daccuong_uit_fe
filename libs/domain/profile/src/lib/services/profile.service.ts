import { Injectable, inject } from '@angular/core';
import { ApiService } from '@fe/core';
import type { ProfileTabId } from '../models/profile-tab.model';

export interface ProfilePayload {
  displayName?: string;
  username?: string;
  bio?: string;
}

export interface ProfileStats {
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  email?: string;
  location?: string;
  isVerified?: boolean;
  isPrivate?: boolean;
  stats?: ProfileStats;
}

export interface ProfileInsights {
  access: {
    weeklyVisits: number;
    growthRate: number;
    storiesViewsIncrease: number;
    reelsViewsIncrease: number;
    videosViewsIncrease: number;
    postsViewsIncrease: number;
  };
  interactions: {
    commentsIncrease: number;
    reactionsIncrease: number;
    sharesIncrease: number;
  };
}

export interface ProfileTabDataResponse {
  data: unknown[];
  meta?: {
    pagination?: {
      currentPage?: number;
      totalPages?: number;
      totalItems?: number;
      itemsPerPage?: number;
      hasNext?: boolean;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private api = inject(ApiService);

  getProfile(userId: string) {
    return this.api.get<ProfileResponse>(`/profiles/${userId}`);
  }

  getProfileInsights(userId: string) {
    return this.api.get<ProfileInsights>(`/profiles/${userId}/profile-insights`);
  }

  getProfileTabData(userId: string, tabId: ProfileTabId, page = 1, pageSize = 20) {
    return this.api.get<ProfileTabDataResponse>(`/profiles/${userId}/profile-tabs/${tabId}`, {
      params: { page, pageSize },
    });
  }

  updateProfile(userId: string, payload: ProfilePayload) {
    return this.api.put<ProfileResponse>(`/profiles/${userId}`, payload);
  }
}
