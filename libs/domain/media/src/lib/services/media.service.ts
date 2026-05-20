import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, appConfig, urlConfig } from '@fe/core';

export interface MediaItem {
  id: string;
  originalName?: string;
  status?: string;
  type?: string;
  storagePath?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private api = inject(ApiService);

  getMediaList(
    userId: string,
    status?: string,
    type?: string,
    page = 1,
    limit = 20,
  ): Observable<MediaItem[]> {
    const params: Record<string, string | number | boolean> = {
      userId,
      page,
      limit,
    };
    if (status) params['status'] = status;
    if (type) params['type'] = type;

    return this.api.get<MediaItem[]>(urlConfig.media.list, {
      params,
      cache: 1000 * 10,
    });
  }

  uploadMedia(formData: FormData) {
    return this.api.post(urlConfig.media.upload, formData);
  }

  deleteMedia(mediaId: string) {
    return this.api.delete(`${urlConfig.media.list}/${mediaId}`);
  }

  getPreviewUrl(mediaId: string) {
    return `${appConfig.apiUrl}/media/${mediaId}/preview`;
  }

  getDownloadUrl(mediaId: string) {
    return `${appConfig.apiUrl}/media/${mediaId}/download`;
  }
}
