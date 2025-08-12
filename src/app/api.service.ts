import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { apiUrl } from './app.config';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private refreshTokens(): Observable<void> {
    const headers = new HttpHeaders({
      'x-app-platform': 'web',
    });

    return this.http.patch<void>(
      `${apiUrl}/refresh`,
      {},
      { headers, withCredentials: true }
    );
  }

  requestWithAuthRetry<T>(
    method: string,
    url: string,
    body?: any
  ): Observable<HttpResponse<T>> {
    const headers = new HttpHeaders({
      'x-app-platform': 'web',
    });

    return this.http
      .request<T>(method, url, {
        body,
        headers,
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.refreshTokens().pipe(
              switchMap(() =>
                this.http.request<T>(method, url, {
                  body,
                  headers,
                  withCredentials: true,
                  observe: 'response',
                })
              ),
              catchError((refreshError) => throwError(() => refreshError))
            );
          }
          return throwError(() => error);
        })
      );
  }
}
