import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Options } from '../../type';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  get<T>(url: string, options: Options): Observable<T>
  {
    return this.httpClient.get<T>(url, options) as Observable<T>;
  }

  post<T>(url: string, body: any, options: Options): Observable<T> {
    return this.httpClient.post<T>(url, body, options) as Observable<T>;
  }

  delete<T>(url: string): Observable<T> {
    return this.httpClient.delete<T>(url) as Observable<T>;
  }
}
