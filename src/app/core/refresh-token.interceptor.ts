import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse } from '@models/login/responses/login.response';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { SessionService } from '@services/session/session.service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError,
} from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const refreshTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authenticationService = inject(AuthenticationService);
  const sessionService = inject(SessionService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown): Observable<HttpEvent<unknown>> => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (!shouldHandle401(error, request)) {
        return throwError(() => error);
      }

      const refreshToken = sessionService.getRefreshToken();

      if (!refreshToken) {
        sessionService.clearSession();
        void router.navigate(['/login']);
        return throwError(() => error);
      }

      if (isRefreshing) {
        return waitForRefreshAndRetry(request, next);
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authenticationService.refreshToken(refreshToken).pipe(
        switchMap((response: LoginResponse): Observable<HttpEvent<unknown>> => {
          sessionService.setSession(response);
          refreshTokenSubject.next(response.accessToken);

          const retryRequest = addAuthorizationHeader(request, response.accessToken);

          return next(retryRequest);
        }),
        catchError((refreshError: unknown): Observable<HttpEvent<unknown>> => {
          sessionService.clearSession();
          void router.navigate(['/login']);
          return throwError(() => refreshError);
        }),
        finalize(() => {
          isRefreshing = false;
        }),
      );
    }),
  );
};

function shouldHandle401(error: HttpErrorResponse, request: HttpRequest<unknown>): boolean {
  if (error.status !== 401) {
    return false;
  }

  if (isAuthExcludedRequest(request.url)) {
    return false;
  }

  return true;
}

function waitForRefreshAndRetry(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return refreshTokenSubject.pipe(
    filter((accessToken): accessToken is string => !!accessToken),
    take(1),
    switchMap((accessToken): Observable<HttpEvent<unknown>> => {
      const retryRequest = addAuthorizationHeader(request, accessToken);
      return next(retryRequest);
    }),
  );
}

function addAuthorizationHeader(
  request: HttpRequest<unknown>,
  accessToken: string,
): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

function isAuthExcludedRequest(url: string): boolean {
  return (
    url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout')
  );
}
