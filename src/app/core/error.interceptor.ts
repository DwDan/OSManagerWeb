import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiErrorResponse } from '@models/api/api-error-response';
import { PoNotificationService } from '@po-ui/ng-components';
import { SessionService } from '@services/session/session.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const notificationService = inject(PoNotificationService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((response: HttpErrorResponse) => {
      handleError(response, notificationService, router);

      return throwError(() => response);
    }),
  );
};

function handleError(
  response: HttpErrorResponse,
  notificationService: PoNotificationService,
  router: Router,
): void {
  if (response.status === 0) {
    notificationService.error('Não foi possível se conectar ao servidor.');

    return;
  }

  const apiError = normalizeError(response.error);

  if (response.status === 401) {
    notifyApiError(notificationService, apiError, 'Não autorizado.');

    if (isAuthRequest(response.url)) {
      return;
    }

    inject(SessionService).clearSession();
    router.navigate(['/login']);
    return;
  }

  if (response.status === 400) {
    notifyApiError(notificationService, apiError, 'Ocorreu um erro de validação.');

    return;
  }

  if (response.status === 403) {
    notifyApiError(notificationService, apiError, 'Acesso negado.');

    return;
  }

  if (response.status === 404) {
    notifyApiError(notificationService, apiError, 'Recurso não encontrado.');

    return;
  }

  if (response.status >= 500) {
    notifyApiError(notificationService, apiError, 'Ocorreu um erro interno inesperado.');

    return;
  }

  notifyApiError(notificationService, apiError, 'Ocorreu um erro inesperado.');
}

function notifyApiError(
  notificationService: PoNotificationService,
  apiError: ApiErrorResponse | null,
  fallbackMessage: string,
): void {
  const errors = apiError?.errors ?? [];
  const detail = apiError?.detail ?? '';

  if (errors.length > 0) {
    for (const error of errors) {
      notificationService.error(error);
    }

    return;
  }

  if (detail) {
    notificationService.error(detail);
    return;
  }

  notificationService.error(fallbackMessage);
}

function normalizeError(error: unknown): ApiErrorResponse | null {
  if (!error || typeof error !== 'object') {
    return null;
  }

  const value = error as Record<string, unknown>;

  return <ApiErrorResponse>{
    title: value['Title'],
    status: value['Status'],
    detail: value['Detail'],
    errors: value['Errors'],
  };
}

function isAuthRequest(url: string | null): boolean {
  if (!url) {
    return false;
  }

  return (
    url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout')
  );
}
