import {
  HttpClient,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpHeaders,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { apiUrl } from './app.config';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (
  req,
  next: HttpHandlerFn
) => {
  const http = inject(HttpClient);

  const modifiedReq = req.clone({
    setHeaders: { 'x-app-platform': 'web' },
    withCredentials: true,
  });

  const url = new URL(req.url);
  if (
    // url.pathname === '/is-logged'||
    url.pathname === '/protected/login'  
    // url.pathname === '/logout'
  ) {
    // when hitting this endpoint we don't want to refresh the tokens.
    return next(modifiedReq);
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;
        return http
          .patch<void>(
            `${apiUrl}/refresh`,
            {},
            {
              headers: new HttpHeaders({ 'x-app-platform': 'web' }),
              withCredentials: true,
            }
          )
          .pipe(
            switchMap(() => {
              isRefreshing = false;
              const retryReq = req.clone({
                setHeaders: { 'x-app-platform': 'web' },
                withCredentials: true,
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              return throwError(() => refreshError);
            })
          );
      }
      return throwError(() => error);
    })
  );
};
