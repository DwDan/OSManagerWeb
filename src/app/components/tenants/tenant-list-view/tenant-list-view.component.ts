import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { tenantsLiterals } from '@i18n/tenants/tenants.literals';
import { TenantPagedItemResponse } from '@models/tenants/responses/tenant-paged-item.response';
import { TenantStatus } from '@models/tenants/types/tenant-status.enum';
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

type TenantTagViewModel = {
  label: string;
  color: string;
  icon: string;
};

@Component({
  selector: 'app-tenant-list-view',
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
  templateUrl: './tenant-list-view.component.html',
  styleUrl: './tenant-list-view.component.scss',
})
export class TenantListViewComponent {
  private readonly devicesService = inject(DevicesService);

  readonly literals = injectI18n(tenantsLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly items = input<TenantPagedItemResponse[]>([]);
  readonly loading = input<boolean>(false);
  readonly columns = input<PoTableColumn[]>([]);
  readonly actions = input<PoTableAction[]>([]);

  readonly spacing = PoTableColumnSpacing;

  readonly isMobile = computed(() => this.devicesService.isMobile());

  getVisibleActions(item: TenantPagedItemResponse): PoTableAction[] {
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

  executeAction(action: PoTableAction, item: TenantPagedItemResponse): void {
    if (!action.action) {
      return;
    }

    action.action(item);
  }

  getStatusTag(status: TenantStatus): TenantTagViewModel {
    const column = this.columns().find((item) => item.property === 'status');

    if (!column || column.type !== 'label' || !column.labels) {
      return {
        label: String(status),
        color: '',
        icon: '',
      };
    }

    const tag = column.labels.find((item) => item.value === status);

    return {
      label: String(tag?.label ?? status),
      color: tag?.color ?? '',
      icon: typeof tag?.icon === 'string' ? tag.icon : '',
    };
  }
}
