import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { appConfig, ApiService } from '@fe/core';
import { CreateReelPayload } from '../models/social-reel.models';

@Injectable({ providedIn: 'root' })
export class SocialReelService {
  private http = inject(HttpClient);
  private api = inject(ApiService);
  private apiUrl = appConfig.apiUrl || 'http://localhost:3000';

  getDiscoverReels(): Observable<any> {
    return this.api.get<any>('/reels/discover');
  }

  getFriendReels(): Observable<any> {
    return this.api.get<any>('/reels/feed');
  }

  createReel(payload: CreateReelPayload): Observable<any> {
    const formData = new FormData();
    formData.append('file', payload.videoFile);

    return this.http
      .post<{ data: { id: string; fileName: string; originalName: string } }>(
        `${this.apiUrl}/media/upload`,
        formData
      )
      .pipe(
        map((res) => `${this.apiUrl}/media/${res.data.id}/file`),
        switchMap((videoUrl) => {
          const dto: any = {
            content: payload.description,
            videoUrl: videoUrl,
          };
          if (payload.music) {
            dto.musicId = payload.music;
          }
          if (payload.privacy) {
            dto.visibility = payload.privacy;
          }
          return this.api.post<any>('/reels', dto).pipe(map(res => res.data));
        })
      );
  }

  getReelComments(reelId: string): Observable<any> {
    return this.api.get<any>(`/reels/${reelId}/comments`);
  }

  likeReel(reelId: string): Observable<any> {
    return this.api.post<any>(`/reels/${reelId}/like`, {});
  }

  unlikeReel(reelId: string): Observable<any> {
    return this.api.delete<any>(`/reels/${reelId}/like`);
  }

  likeComment(commentId: string): Observable<any> {
    return this.api.post<any>(`/comments/${commentId}/like`, {});
  }

  unlikeComment(commentId: string): Observable<any> {
    return this.api.delete<any>(`/comments/${commentId}/like`);
  }

  submitComment(reelId: string, content: string): Observable<any> {
    return this.api.post<any>(`/reels/${reelId}/comments`, { content }).pipe(map(res => res.data));
  }
}
