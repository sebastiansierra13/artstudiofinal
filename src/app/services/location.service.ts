import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Departamento, Municipio, Region } from '../interfaces/interfaces-app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}`;
  private headers = new HttpHeaders().set('Accept', 'application/json; charset=utf-8');

  constructor(private http: HttpClient) {}

  private fixEncoding(text: string): string {
    try {
      return decodeURIComponent(escape(text));
    } catch {
      // Si falla, intentamos otra aproximación
      return text.replace(/├í|├®|├¡|├│|├║|├ü|├ë|├ì|├ô|├Ü|├▒|├æ/g, match => {
        const fixes: { [key: string]: string } = {
          '├í': 'á', '├®': 'é', '├¡': 'í', '├│': 'ó', '├║': 'ú',
          '├ü': 'Á', '├ë': 'É', '├ì': 'Í', '├ô': 'Ó', '├Ü': 'Ú',
          '├▒': 'ñ', '├æ': 'Ñ'
        };
        return fixes[match] || match;
      });
    }
  }

  getRegions(): Observable<Region[]> {
    return this.http.get<{$id: string, $values: Region[]}>(`${this.apiUrl}/api/regions`, { headers: this.headers }).pipe(
      map(response => response.$values.map(region => ({ ...region, nombre: this.fixEncoding(region.nombre) })))
    );
  }

  getDepartments(): Observable<Departamento[]> {
    return this.http.get<{$id: string, $values: Departamento[]}>(`${this.apiUrl}/api/departments`, { headers: this.headers }).pipe(
      map(response => response.$values.map(department => ({ ...department, nombre: this.fixEncoding(department.nombre) })))
    );
  }

  getMunicipalities(): Observable<Municipio[]> {
    return this.http.get<{$id: string, $values: Municipio[]}>(`${this.apiUrl}/api/municipalities`, { headers: this.headers }).pipe(
      map(response => response.$values.map(municipality => ({ ...municipality, nombre: this.fixEncoding(municipality.nombre) })))
    );
  }
}