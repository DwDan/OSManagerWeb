import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { MenuService } from '@services/menu/menu.service';

export const menuPermissionGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const router = inject(Router);
  const menuService = inject(MenuService);

  const path = `/${segments.map((segment) => segment.path).join('/')}`;

  const expectedLink = route.data?.['menuLink'] as string | undefined;
  const linkToCheck = expectedLink ?? path;

  const hasAccess = menuService.hasAccess(linkToCheck);

  if (hasAccess) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};
