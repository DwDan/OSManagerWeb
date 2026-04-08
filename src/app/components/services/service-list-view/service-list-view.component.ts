import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { commonLiterals } from '@i18n/common/common.literals';
import { servicesLiterals } from '@i18n/services/services.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { ServiceResponse } from '@models/services/responses/service.response';
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
  selector: 'app-service-list-view',
  standalone: true,
  imports: [CommonModule, PoTableModule, PoListViewModule, PoInfoModule, PoWidgetModule],
  providers: [CurrencyPipe],
  templateUrl: './service-list-view.component.html',
  styleUrl: './service-list-view.component.scss',
})
export class ServiceListViewComponent {
  private readonly devicesService = inject(DevicesService);
  private readonly currencyPipe = inject(CurrencyPipe);

  readonly literals = injectI18n(servicesLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly items = input<ServiceResponse[]>([]);
  readonly loading = input<boolean>(false);
  readonly columns = input<PoTableColumn[]>([]);
  readonly actions = input<PoTableAction[]>([]);

  readonly spacing = PoTableColumnSpacing;

  readonly isMobile = computed(() => this.devicesService.isMobile());

  getVisibleActions(item: ServiceResponse): PoTableAction[] {
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

  executeAction(action: PoTableAction, item: ServiceResponse): void {
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
      this.currencyPipe.transform(value, 'BRL', 'symbol', '1.2-2') ?? this.common().notInformed
    );
  }
}
