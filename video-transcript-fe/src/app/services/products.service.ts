import { Injectable } from '@angular/core';
import { VideoResponse, VideoSearchResponse } from '../../type';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  // Fetching videos from the API
  getVideos(url: string): Observable<VideoResponse> {
    return this.apiService.get<VideoResponse>(url, {
      responseType: 'json',
    });
  }

  // Upload a new video
  notifyBackend(url: string, formData: FormData): Observable<any> { 
    return this.apiService.post<any>(url, formData, {
      responseType: 'json' 
    });
  }

  // Step 2: Upload the video file directly to GCS
  uploadToGCS(uploadUrl: string, file: File): Observable<any> {
    return this.http.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type },
      reportProgress: true,
      observe: 'events',  // Track upload progress
    });
  }

  // Upload a new video
  deleteVideo(url: string): Observable<any> { 
    return this.apiService.delete<any>(url);
  }

   // Step 1: Get a signed URL from the backend
   getSignedUrl(videoName: string): Observable<any> {
    const formData = new FormData();
    formData.append('video_name', videoName);
    return this.apiService.post('http://0.0.0.0:8000/generate_upload_url', formData, {
      responseType: 'json' 
    });
  }

  // Search messages in a video
  searchVideoMessages(videoId: string, query: string): Observable<VideoSearchResponse> {
    const body = { query };  // Ensure this matches what the backend expects

    return this.apiService.post<any>(`http://0.0.0.0:8000/video/${videoId}/search`, body ,{
      responseType: 'json'
    });
  }

}
