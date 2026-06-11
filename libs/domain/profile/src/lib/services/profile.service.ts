import { Injectable, inject } from '@angular/core';
import { ApiService } from '@fe/core';

export interface ProfilePayload {
  displayName?: string;
  username?: string;
  bio?: string;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  displayName?: string;
  username?: string;
  bio?: string;
  email?: string;
}

export interface ProfileTabsResponse {
  tabs: {
    id: string;
    label: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private api = inject(ApiService);

  getProfile(userId: string) {
    return this.api.get<ProfileResponse>(`/users/${userId}`);
  }

  getProfileTabs(userId: string) {
    return this.api.get<ProfileTabsResponse>(`/users/${userId}/profile-tabs`);
  }

  updateProfile(userId: string, payload: ProfilePayload) {
    return this.api.put<ProfileResponse>(`/users/${userId}`, payload);
  }
}
