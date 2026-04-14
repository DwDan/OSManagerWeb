import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { authInterceptor } from '@core/authentication-interceptor';
import { errorInterceptor } from '@core/error.interceptor';
import { refreshTokenInterceptor } from '@core/refresh-token.interceptor';
import { PoHttpRequestModule, PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { routes } from './app.routes';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from './i18n/shared/i18n.constants';

const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? DEFAULT_LANGUAGE;

const i18nConfig: PoI18nConfig = {
  default: {
    language: savedLanguage,
  },
  contexts: {
    general: {
      'pt-BR': {},
      'en-US': {},
    },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor, refreshTokenInterceptor]),
    ),
    importProvidersFrom(PoHttpRequestModule, PoI18nModule.config(i18nConfig)),
    provideAnimations(),
  ],
};
