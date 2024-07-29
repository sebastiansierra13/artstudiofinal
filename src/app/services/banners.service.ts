import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Banner } from '../interfaces/interfaces-app';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannersService {
  private apiUrl = `${environment.apiUrl}/api/banner`;

  constructor(private http: HttpClient) { }

  getBanners(): Observable<Banner[]> {
    return this.http.get<{ $id: string, $values: Banner[] }>(this.apiUrl).pipe(
      map(response => response.$values)
    );
  }

  addBanner(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
  postBulkBanners(urls: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bulk`, urls);
  }
}
