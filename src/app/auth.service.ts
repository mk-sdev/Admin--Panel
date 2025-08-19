import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
// import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/protected/login`, {
      email,
      password,
    });
  }

  checkSession(): Observable<any> {
    return this.http.get(this.apiUrl + '/is-logged'); 
  }

  isLoggedIn(): Promise<boolean> {
    return firstValueFrom(this.checkSession())
      .then(() => true)
      .catch(() => false);
  }

  router = inject(Router);

  logout(): Observable<any> {
    this.router.navigate(['/login']);
    return this.http.patch(`${this.apiUrl}/logout`, {});
  }
}
