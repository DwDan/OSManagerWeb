import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { PoMenuItem } from '@po-ui/ng-components';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/menus`;
  private readonly storageKey = 'menus';

  readonly menus = signal<PoMenuItem[]>(this.getMenusFromStorage());

  loadMenus(): Observable<PoMenuItem[]> {
    if (this.menus().length > 0) {
      return of(this.menus());
    }

    return this.http.get<PoMenuItem[]>(this.baseUrl).pipe(
      tap((menus) => {
        this.menus.set(menus);
        sessionStorage.setItem(this.storageKey, JSON.stringify(menus));
      }),
    );
  }

  getMenus(): PoMenuItem[] {
    return this.menus();
  }

  setMenus(menus: PoMenuItem[]): void {
    this.menus.set(menus);
    sessionStorage.setItem(this.storageKey, JSON.stringify(menus));
  }

  clear(): void {
    this.menus.set([]);
    sessionStorage.removeItem(this.storageKey);
  }

  private getMenusFromStorage(): PoMenuItem[] {
    const menus = sessionStorage.getItem(this.storageKey);

    if (!menus) {
      return [];
    }

    try {
      return JSON.parse(menus) as PoMenuItem[];
    } catch {
      return [];
    }
  }

  hasAccess(link: string): boolean {
    const menus = this.menus();

    return this.containsLink(menus, link);
  }

  private containsLink(items: PoMenuItem[], link: string): boolean {
    for (const item of items) {
      if (item.link === link) {
        return true;
      }

      if (item.subItems?.length && this.containsLink(item.subItems, link)) {
        return true;
      }
    }

    return false;
  }
}
