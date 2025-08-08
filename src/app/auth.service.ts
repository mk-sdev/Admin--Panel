import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/login`,
      { email, password },
      { withCredentials: true }
    );
  }
  checkSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, { withCredentials: true });
  }

  isLoggedIn(): Promise<boolean> {
    return firstValueFrom(this.checkSession())
      .then(() => true)
      .catch(() => false);
  }

  logout() {
    return this.http.patch(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }
}
