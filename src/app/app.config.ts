import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { LoginModule } from '@components/auth/login/login.module';
import { authInterceptor } from '@core/authentication-interceptor';
import { PoHttpRequestModule, PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { routes } from './app.routes';

const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
  },
  contexts: {
    general: {
      'pt-BR': {},
    },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(PoHttpRequestModule, PoI18nModule.config(i18nConfig), LoginModule),
    provideAnimations(),
  ],
};
