import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { I18nStore } from '@i18n/shared/i18n.store';
import { SessionService } from '@services/session/session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);
  const i18nStore = inject(I18nStore);

  const token = sessionService.getAccessToken();
  const language = i18nStore.currentLanguage();

  const authReq = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Accept-Language': language,
    },
  });

  return next(authReq);
};
