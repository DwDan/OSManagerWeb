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
  PoTagModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { DevicesService } from '@services/devices/devices.service';

type OrderTagViewModel = {
  label: string;
  color?: string;
  icon?: string;
};

@Component({
  selector: 'app-order-list-view',
  standalone: true,
  imports: [
    CommonModule,
    PoTableModule,
    PoListViewModule,
    PoInfoModule,
    PoWidgetModule,
    PoTagModule,
  ],
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

  getStatusTag(status: OrderStatus): OrderTagViewModel {
    const column = this.columns().find((item) => item.property === 'status');

    if (!column || column.type !== 'label' || !column.labels) {
      return {
        label: String(status),
      };
    }

    const tag = column.labels.find((item) => item.value === status);

    return {
      label: String(tag?.label ?? status),
      color: tag?.color,
      icon: typeof tag?.icon === 'string' ? tag.icon : undefined,
    };
  }

  getExecutionResultTag(result: ExecutionResult | null | undefined): OrderTagViewModel {
    if (result === null || result === undefined) {
      return {
        label: this.common().notInformed,
      };
    }

    const column = this.columns().find((item) => item.property === 'executionResult');

    if (!column || column.type !== 'label' || !column.labels) {
      return {
        label: String(result),
      };
    }

    const tag = column.labels.find((item) => item.value === result);

    return {
      label: String(tag?.label ?? result),
      color: tag?.color,
      icon: typeof tag?.icon === 'string' ? tag.icon : undefined,
    };
  }
}
