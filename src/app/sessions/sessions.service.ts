import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getSessions(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/session');
  }

  createSession(): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/session', {});
  }
}