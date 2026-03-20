import { Component, inject } from '@angular/core';
import {
  PoToolbarModule,
  PoPageModule,
  PoMenuModule,
  PoMenuItem,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PoToolbarModule, PoPageModule, PoMenuModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  samplePoMenuHumanResourcesService = inject(SamplePoMenuHumanResourcesService);

  menuItemSelected: string = 'Register user';

  menus: Array<PoMenuItem> = [
    {
      label: 'Register user',
      action: this.printMenuAction.bind(this),
      icon: 'an an-user',
      shortLabel: 'Register',
    },
    {
      label: 'Timekeeping',
      action: this.printMenuAction.bind(this),
      icon: 'an an-clock',
      shortLabel: 'Timekeeping',
      badge: { value: 1 },
    },
    {
      label: 'Useful links',
      icon: 'an an-share',
      shortLabel: 'Links',
      subItems: [
        {
          label: 'Ministry of Labour',
          action: this.printMenuAction.bind(this),
          link: 'http://trabalho.gov.br/',
        },
        {
          label: 'SindPD Syndicate',
          action: this.printMenuAction.bind(this),
          link: 'http://www.sindpd.com.br/',
        },
      ],
    },
    {
      label: 'Benefits',
      icon: 'an an-star',
      shortLabel: 'Benefits',
      subItems: [
        {
          label: 'Meal tickets',
          subItems: [
            {
              label: 'Acceptance network ',
              action: this.printMenuAction.bind(this),
            },
            {
              label: 'Extracts',
              action: this.printMenuAction.bind(this),
              subItems: [
                {
                  label: 'Monthly',
                  action: this.printMenuAction.bind(this),
                  badge: { value: 3, color: 'color-03' },
                },
                { label: 'Custom', action: this.printMenuAction.bind(this) },
              ],
            },
          ],
        },
        {
          label: 'Transportation tickets',
          action: this.printMenuAction.bind(this),
          badge: { value: 12 },
        },
      ],
    },
  ];

  printMenuAction(menu: PoMenuItem) {
    this.menuItemSelected = menu.label;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PoMenuFilter, PoMenuItemFiltered } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root'
})
export class SamplePoMenuHumanResourcesService implements PoMenuFilter {
  private http = inject(HttpClient);

  private url: string = 'https://po-sample-api.onrender.com/v1/menus';

  getFilteredData(search: string): Observable<Array<PoMenuItemFiltered>> {
    const params = { search };

    return this.http.get(this.url, { params }).pipe(map((response: any) => response.items));
  }
}
