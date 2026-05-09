import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { commonLiterals } from '@i18n/common/common.literals';
import { customRecordsLiterals } from '@i18n/custom-records/custom-records.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import {
  PoInfoModule,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
  PoTagModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { DevicesService } from '@services/devices/devices.service';
import { Row } from '../custom-records.component';

type TagViewModel = {
  label: string;
  color?: string;
  icon?: string;
};

@Component({
  selector: 'app-custom-record-list-view',
  standalone: true,
  imports: [CommonModule, PoTableModule, PoInfoModule, PoWidgetModule, PoTagModule],
  templateUrl: './custom-record-list-view.component.html',
  styleUrl: './custom-record-list-view.component.scss',
})
export class CustomRecordListViewComponent {
  private readonly devicesService = inject(DevicesService);

  readonly literals = injectI18n(customRecordsLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly items = input<Row[]>([]);
  readonly loading = input<boolean>(false);
  readonly columns = input<PoTableColumn[]>([]);
  readonly actions = input<PoTableAction[]>([]);
  readonly fields = input<CustomFieldResponse[]>([]);

  readonly spacing = PoTableColumnSpacing;
  readonly isMobile = computed(() => this.devicesService.isMobile());

  readonly mobileFields = computed(() =>
    this.fields()
      .filter((field) => field.isVisibleInList)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  );

  getVisibleActions(item: Row): PoTableAction[] {
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

  executeAction(action: PoTableAction, item: Row): void {
    if (!action.action) {
      return;
    }

    action.action(item);
  }

  fieldValue(item: Row, field: CustomFieldResponse): string {
    const value = item[`field_${field.key}`];

    return value?.trim() ? value : this.common().notInformed;
  }

  getStatusTag(statusId?: string | null): TagViewModel {
    if (!statusId) {
      return { label: this.common().notInformed };
    }

    const column = this.columns().find((item) => item.property === 'customStatusId');

    if (!column || column.type !== 'label' || !column.labels) {
      return { label: statusId };
    }

    const tag = column.labels.find((item) => item.value === statusId);

    return {
      label: String(tag?.label ?? statusId),
      color: tag?.color,
      icon: typeof tag?.icon === 'string' ? tag.icon : undefined,
    };
  }
}
