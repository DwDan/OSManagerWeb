import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { I18nStore } from '@i18n/shared/i18n.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token');

  const i18nStore = inject(I18nStore);
  const language = i18nStore.currentLanguage();

  const authReq = req.clone({
    setHeaders: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Accept-Language': language,
    },
  });

  return next(authReq);
};
