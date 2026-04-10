import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { commonLiterals } from '@i18n/common/common.literals';
import { ordersLiterals } from '@i18n/orders/orders.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { OrderListItemResponse } from '@models/orders/responses/order-list-item.response';
import { ExecutionResult } from '@models/orders/types/execution-result.enum';
import { OrderStatus } from '@models/orders/types/order-status.enum';
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
  selector: 'app-order-list-view',
  standalone: true,
  imports: [CommonModule, PoTableModule, PoListViewModule, PoInfoModule, PoWidgetModule],
  templateUrl: './order-list-view.component.html',
  styleUrl: './order-list-view.component.scss',
})
export class OrderListViewComponent {
  private readonly devicesService = inject(DevicesService);

  readonly literals = injectI18n(ordersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly items = input<OrderListItemResponse[]>([]);
  readonly loading = input<boolean>(false);
  readonly columns = input<PoTableColumn[]>([]);
  readonly actions = input<PoTableAction[]>([]);

  readonly spacing = PoTableColumnSpacing;

  readonly isMobile = computed(() => this.devicesService.isMobile());

  getVisibleActions(item: OrderListItemResponse): PoTableAction[] {
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

  executeAction(action: PoTableAction, item: OrderListItemResponse): void {
    if (!action.action) {
      return;
    }

    action.action(item);
  }

  getStatusLabel(status: OrderStatus): string {
    const column = this.columns().find((item) => item.property === 'status');

    if (!column || column.type !== 'label' || !column.labels) {
      return String(status);
    }

    const label = column.labels.find((item) => item.value === status);
    return String(label?.label ?? status);
  }

  getExecutionResultLabel(result: ExecutionResult | null | undefined): string {
    if (result === null || result === undefined) {
      return this.common().notInformed;
    }

    const column = this.columns().find((item) => item.property === 'executionResult');

    if (!column || column.type !== 'label' || !column.labels) {
      return String(result);
    }

    const label = column.labels.find((item) => item.value === result);
    return String(label?.label ?? result);
  }
}
