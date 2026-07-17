import { Injectable, signal, inject } from '@angular/core';
import {
  ProfileService,
  ProfileResponse,
  ProfileInsights,
  ProfileTabDataResponse,
  ProfileFriend,
  ProfileGroup,
  ProfilePost,
  ProfileTab,
} from '@fe/domain/profile';
import { SocialUserService, UserStatistics } from '@fe/domain/social';
import { take, catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileFacade {
  private readonly profileService = inject(ProfileService);
  private readonly socialService = inject(SocialUserService);

  private readonly _profile = signal<ProfileResponse | null>(null);
  private readonly _stats = signal<UserStatistics | null>(null);
  private readonly _friends = signal<ProfileFriend[]>([]);
  private readonly _tabs = signal<ProfileTab[]>([]);
  private readonly _insights = signal<ProfileInsights | null>(null);
  private readonly _posts = signal<ProfilePost[]>([]);
  private readonly _groups = signal<ProfileGroup[]>([]);
  private readonly _tabData = signal<ProfileTabDataResponse | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly profile = this._profile.asReadonly();
  readonly stats = this._stats.asReadonly();
  readonly friends = this._friends.asReadonly();
  readonly tabs = this._tabs.asReadonly();
  readonly insights = this._insights.asReadonly();
  readonly posts = this._posts.asReadonly();
  readonly groups = this._groups.asReadonly();
  readonly tabData = this._tabData.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  loadProfile(userId: string) {
    this._isLoading.set(true);
    this._error.set(null);

    const defaultTabs: ProfileTab[] = [
      { id: 'posts', label: 'Bài đăng', count: undefined },
      { id: 'reels', label: 'Reels', count: undefined },
      { id: 'videos', label: 'Videos', count: undefined },
      { id: 'stories', label: 'Stories', count: undefined },
      { id: 'novels', label: 'Truyện', count: undefined },
      { id: 'friends', label: 'Bạn bè', count: undefined },
      { id: 'groups', label: 'Nhóm', count: undefined },
    ];
    this._tabs.set(defaultTabs);

    forkJoin({
      profile: this.profileService.getProfile(userId).pipe(take(1), catchError(() => of(null))),
      stats: this.socialService.getUserStatistics(userId).pipe(take(1), catchError(() => of(null))),
      insights: this.profileService.getProfileInsights(userId).pipe(take(1), catchError(() => of(null))),
    }).subscribe({
      next: (data) => {
        this._profile.set(data.profile);
        this._stats.set({
          userId,
          postsCount: data.profile?.stats?.postCount ?? data.stats?.postsCount ?? 0,
          followersCount: data.profile?.stats?.followerCount ?? data.stats?.followersCount ?? 0,
          followingCount: data.profile?.stats?.followingCount ?? data.stats?.followingCount ?? 0,
          likesReceivedCount: data.stats?.likesReceivedCount ?? 0,
          engagementRate: data.stats?.engagementRate ?? 0,
        });
        this._insights.set(data.insights);
        this._isLoading.set(false);
      },
      error: (err) => {
        this._error.set(err.message || 'Lỗi tải hồ sơ người dùng');
        this._isLoading.set(false);
      },
    });
  }

  loadProfileTabData(userId: string, tabId: string) {
    this.profileService.getProfileTabData(userId, tabId as any).pipe(take(1)).subscribe({
      next: (tabData) => {
        this._tabData.set(tabData);

        if (tabId === 'posts') {
          this._posts.set((tabData.data as ProfilePost[]) ?? []);
        } else if (tabId === 'groups') {
          this._groups.set((tabData.data as ProfileGroup[]) ?? []);
        } else if (tabId === 'friends') {
          this._friends.set((tabData.data as ProfileFriend[]) ?? []);
        }
      },
      error: () => {
        this._tabData.set({ data: [] });
        if (tabId === 'posts') this._posts.set([]);
        if (tabId === 'groups') this._groups.set([]);
        if (tabId === 'friends') this._friends.set([]);
      },
    });
  }
}
