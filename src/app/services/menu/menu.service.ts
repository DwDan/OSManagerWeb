import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { PoMenuItem } from '@po-ui/ng-components';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/menus`;
  private readonly menusSignal = signal<PoMenuItem[] | null>(null);
  public readonly menus = this.menusSignal.asReadonly();

  getMenus(): Observable<PoMenuItem[]> {
    return this.http.get<PoMenuItem[]>(this.baseUrl);
  }

  loadMenus(): Observable<PoMenuItem[]> {
    const currentMenus = this.menusSignal();

    if (currentMenus) {
      return of(currentMenus);
    }

    return this.getMenus().pipe(tap((menus) => this.menusSignal.set(menus)));
  }

  hasAccess(link: string): Observable<boolean> {
    return this.loadMenus().pipe(map((menus) => menus.some((menu) => menu.link === link)));
  }

  clear(): void {
    this.menusSignal.set(null);
  }
}
