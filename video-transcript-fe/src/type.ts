import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface Options {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  context?: HttpContext;
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
}

export interface Video {
    video_id: string;
    name: string;
    category: string;
    description: string;
    url: string;
  }
  
export interface VideoResponse {
    success: boolean;
    message: string;
    data: {
        videos: Video[];
    };
}

export interface VideoUploadRequest {
    name: string;
    category: string;
    description: string; 
    file: File; 
  }

  export interface VideoSearchResponse {
    success: boolean;
    message: string;
    data: {
      results: VideoSearchResult[];
    };
  }
  
  export interface VideoSearchResult {
    seconds: number;
    time: string;
    text: string;
    video_link: string;
  }
  