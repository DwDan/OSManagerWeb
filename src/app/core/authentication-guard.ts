import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@services/session/session.service';

export const authGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const accessToken = sessionService.getAccessToken();

  if (accessToken) {
    return true;
  }

  return inject(Router).createUrlTree(['/login']);
};
