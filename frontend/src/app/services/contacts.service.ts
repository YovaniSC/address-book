import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private baseUrl = 'http://127.0.0.1:8000/api/contacts';

  constructor(private http: HttpClient) {}

  list(search = '', page = 1, perPage = 20): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('per_page', perPage);

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get(this.baseUrl, { params });
  }

  get(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  create(payload: any): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  update(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
