import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { commonLiterals } from '@i18n/common/common.literals';
import { plansLiterals } from '@i18n/plans/plans.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { PlanListItemResponse } from '@models/plans/responses/plan-list-item.response';
import {
  PoButtonModule,
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

@Component({
  selector: 'app-plan-list-view',
  standalone: true,
  imports: [
    CommonModule,
    PoTableModule,
    PoListViewModule,
    PoInfoModule,
    PoWidgetModule,
    PoTagModule,
    PoButtonModule,
  ],
  providers: [CurrencyPipe],
  templateUrl: './plan-list-view.component.html',
  styleUrl: './plan-list-view.component.scss',
})
export class PlanListViewComponent {
  private readonly devicesService = inject(DevicesService);
  private readonly currencyPipe = inject(CurrencyPipe);

  readonly literals = injectI18n(plansLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly items = input<PlanListItemResponse[]>([]);
  readonly loading = input<boolean>(false);
  readonly columns = input<PoTableColumn[]>([]);
  readonly actions = input<PoTableAction[]>([]);

  readonly spacing = PoTableColumnSpacing;
  readonly isMobile = computed(() => this.devicesService.isMobile());

  getVisibleActions(item: PlanListItemResponse): PoTableAction[] {
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

  executeAction(action: PoTableAction, item: PlanListItemResponse): void {
    if (!action.action) {
      return;
    }

    action.action(item);
  }

  formatCurrency(value: number | null | undefined): string {
    if (value == null) {
      return this.common().notInformed;
    }

    return (
      this.currencyPipe.transform(value, 'BRL', 'symbol', '1.2-2') || this.common().notInformed
    );
  }

  formatMaxOrders(value: number | null | undefined): string {
    if (value == null) {
      return this.literals().common.unlimited;
    }

    return String(value);
  }

  formatMaxUsers(value: number): string {
    if (value === 2147483647) {
      return this.literals().common.unlimited;
    }

    return String(value);
  }
}
