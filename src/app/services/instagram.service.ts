import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstagramService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getLatestPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/instagram/latest-posts`);
  }
  

  initiateInstagramAuth() {
    window.location.href = `${this.apiUrl}/instagram/auth`;
  }
}
