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

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private api = inject(ApiService);

  getMyProfile() {
    return this.api.get<ProfileResponse>('/profiles/me');
  }

  updateProfile(userId: string, payload: ProfilePayload) {
    return this.api.patch<ProfileResponse>(`/profiles/user/${userId}`, payload);
  }
}
