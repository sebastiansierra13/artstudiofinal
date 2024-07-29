import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Tag } from '../interfaces/interfaces-app';
import { environment } from '../../environments/environment';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = `${environment.apiUrl}/api/tags`; // Ajusta la URL según sea necesario

  constructor(private http: HttpClient) {}

  obtenerTags(): Observable<Tag[]> {
    return this.http.get<{$id: string, $values: Tag[] }>(this.apiUrl).pipe(
      map(response => {
        return response.$values;
      })
    );
  }
}
