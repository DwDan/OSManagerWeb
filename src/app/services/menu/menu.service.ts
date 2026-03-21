import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoMenuFilter, PoMenuItem, PoMenuItemFiltered } from '@po-ui/ng-components';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements PoMenuFilter {
  private menus: PoMenuItem[] = [];
  private router = inject(Router);

  setMenus(menus: PoMenuItem[]): void {
    this.menus = menus;
  }

  getFilteredData(search: string): Observable<PoMenuItemFiltered[]> {
    const termo = search.trim().toLowerCase();

    const menusFiltrados = this.menus
      .filter((menu) => {
        if (!termo) {
          return true;
        }

        const label = menu.label?.toLowerCase() ?? '';
        const shortLabel = menu.shortLabel?.toLowerCase() ?? '';

        return label.includes(termo) || shortLabel.includes(termo);
      })
      .map((menu) => ({
        label: menu.label ?? '',
        link: menu.link ?? '',
        action: () => {
          if (menu.link) {
            this.router.navigateByUrl(menu.link);
          }
        },
      }));

    return of(menusFiltrados);
  }
}
