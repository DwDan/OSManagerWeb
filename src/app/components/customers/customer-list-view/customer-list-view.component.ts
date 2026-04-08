import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { commonLiterals } from '@i18n/common/common.literals';
import { customersLiterals } from '@i18n/customers/customers.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomerListItemResponse } from '@models/customers/responses/customer-list-item.response';
import {
  PoInfoModule,
  PoListViewModule,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { DevicesService } from '@services/devices/devices.service';

@Component({
  selector: 'app-customer-list-view',
  standalone: true,
  imports: [CommonModule, PoTableModule, PoListViewModule, PoInfoModule, PoWidgetModule],
  templateUrl: './customer-list-view.component.html',
  styleUrl: './customer-list-view.component.scss',
})
export class CustomerListViewComponent {
  private readonly devicesService = inject(DevicesService);

  readonly literals = injectI18n(customersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly items = input<CustomerListItemResponse[]>([]);
  readonly loading = input<boolean>(false);
  readonly columns = input<PoTableColumn[]>([]);
  readonly actions = input<PoTableAction[]>([]);

  readonly spacing = PoTableColumnSpacing;

  readonly isMobile = computed(() => this.devicesService.isMobile());

  getVisibleActions(item: CustomerListItemResponse): PoTableAction[] {
    return this.actions().filter((action) => {
      if (action.visible == null) {
        return true;
      }

      if (typeof action.visible === 'function') {
        return action.visible(item);
      }

      return action.visible;
    });
  }

  executeAction(action: PoTableAction, item: CustomerListItemResponse): void {
    if (!action.action) {
      return;
    }

    action.action(item);
  }
}
