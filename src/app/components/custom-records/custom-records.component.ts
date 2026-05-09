import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '@components/shared/pagination/pagination.component';
import { CustomFieldsFilterComponent, CustomFieldsFilterValue } from '@components/shared/custom-fields-filter/custom-fields-filter.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customRecordsLiterals } from '@i18n/custom-records/custom-records.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomEntityRecordResponse } from '@models/customization/responses/custom-entity-record.response';
import { CustomEntityResponse } from '@models/customization/responses/custom-entity.response';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import { CustomFunctionResponse } from '@models/customization/responses/custom-function.response';
import { CustomStatusResponse } from '@models/customization/responses/custom-status.response';
import { CustomStatusTransitionResponse } from '@models/customization/responses/custom-status-transition.response';
import { PoDialogService, PoNotificationService, PoPageAction, PoPageModule, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { CustomizationService } from '@services/customization/customization.service';
import { ModalService } from '@services/modal/modal.service';
import { finalize, forkJoin } from 'rxjs';
import { CustomFunctionExecuteModalComponent } from './custom-function-execute-modal/custom-function-execute-modal.component';
import { CustomRecordDetailModalComponent } from './custom-record-detail-modal/custom-record-detail-modal.component';
import { CustomRecordListViewComponent } from './custom-record-list-view/custom-record-list-view.component';
import { CustomRecordModalComponent } from './custom-record-modal/custom-record-modal.component';

export type Row = CustomEntityRecordResponse & {
  [key: `field_${string}`]: string | null | undefined;
};

@Component({
  selector: 'app-custom-records',
  standalone: true,
  imports: [CommonModule, PoPageModule, PaginationComponent, CustomFieldsFilterComponent, CustomRecordListViewComponent],
  templateUrl: './custom-records.component.html',
})
export class CustomRecordsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(CustomizationService);
  private readonly modalService = inject(ModalService);
  private readonly dialog = inject(PoDialogService);
  private readonly notification = inject(PoNotificationService);

  readonly literals = injectI18n(customRecordsLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);
  readonly entity = signal<CustomEntityResponse | null>(null);
  readonly fields = signal<CustomFieldResponse[]>([]);
  readonly statuses = signal<CustomStatusResponse[]>([]);
  readonly statusTransitions = signal<CustomStatusTransitionResponse[]>([]);
  readonly functions = signal<CustomFunctionResponse[]>([]);
  readonly items = signal<Row[]>([]);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly totalItems = signal(0);
  readonly filters = signal<CustomFieldsFilterValue>({ customFields: {} });

  readonly title = computed(() => this.entity()?.name ?? this.common().loading);

  readonly pageActions = computed<PoPageAction[]>(() => [
    {
      label: this.literals().actions.create,
      icon: 'an an-plus',
      type: 'primary',
      disabled: this.loading() || !this.entity(),
      action: () => this.openRecordModal(),
    },
  ]);

  readonly columns = computed<PoTableColumn[]>(() => [
    { property: 'name', label: this.literals().columns.name },
    {
      property: 'customStatusId',
      label: this.literals().columns.status,
      type: 'label',
      labels: this.statuses().map((status) => ({
        value: status.id,
        label: status.name,
        color: status.color || 'color-10',
      })),
    },
    ...this.fields()
      .filter((field) => field.isVisibleInList)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((field) => ({ property: `field_${field.key}`, label: field.name }) satisfies PoTableColumn),
  ]);

  readonly tableActions = computed<PoTableAction[]>(() => [
    {
      label: this.literals().actions.details,
      action: (row: Row) => this.openDetails(row),
    },
    {
      label: this.literals().actions.edit,
      action: (row: Row) => this.openRecordModal(row),
    },
    ...this.functions().map((fn) => ({
      label: fn.name,
      action: (row: Row) => this.executeFunction(row, fn),
      visible: (row: Row) => this.canExecuteFunction(row, fn),
    })),
    {
      label: this.literals().actions.delete,
      action: (row: Row) => this.deleteRecord(row),
    },
  ]);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const key = params.get('key');
      if (key) {
        this.loadDefinition(key);
      }
    });
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadRecords();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize.set(pageSize);
    this.page.set(1);
    this.loadRecords();
  }

  onFilterChange(filter: CustomFieldsFilterValue): void {
    this.filters.set(filter);
    this.page.set(1);
    this.loadRecords();
  }

  private loadDefinition(key: string): void {
    this.loading.set(true);

    this.service
      .getCustomEntities()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (entities) => {
          const entity = entities.find((item) => item.key === key) ?? null;
          this.entity.set(entity);

          if (entity) {
            this.loadMetadataAndRecords(entity);
          }
        },
      });
  }

  private loadMetadataAndRecords(entity: CustomEntityResponse): void {
    this.loading.set(true);

    forkJoin({
      fields: this.service.getFields('CustomEntityRecord', entity.id),
      statuses: this.service.getStatuses('CustomEntityRecord', entity.id),
      statusTransitions: this.service.getStatusTransitions('CustomEntityRecord', entity.id),
      functions: this.service.getFunctions('CustomEntityRecord', entity.id),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ fields, statuses, statusTransitions, functions }) => {
          this.fields.set(fields);
          this.statuses.set(statuses);
          this.statusTransitions.set(statusTransitions);
          this.functions.set(functions);
          this.loadRecords();
        },
      });
  }

  private loadRecords(): void {
    const entity = this.entity();
    if (!entity) {
      return;
    }

    this.loading.set(true);
    this.service
      .getPagedCustomEntityRecords(entity.id, {
        page: this.page(),
        pageSize: this.pageSize(),
        name: this.filters().name,
        customFields: this.filters().customFields,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.page.set(response.page);
          this.pageSize.set(response.pageSize);
          this.totalItems.set(response.totalItems);
          this.items.set(response.items.map((item) => this.toRow(item)));
        },
      });
  }

  private openRecordModal(item?: CustomEntityRecordResponse): void {
    const entity = this.entity();
    if (!entity) {
      return;
    }

    this.modalService.open(CustomRecordModalComponent, { entity, fields: this.fields(), item }).subscribe((result) => {
      if (result?.confirmed) {
        this.loadRecords();
      }
    });
  }

  private openDetails(row: Row): void {
    this.modalService.open(CustomRecordDetailModalComponent, { recordId: row.id, statuses: this.statuses() }).subscribe();
  }

  private executeFunction(row: Row, fn: CustomFunctionResponse): void {
    if (fn.inputs.length > 0) {
      this.modalService.open(CustomFunctionExecuteModalComponent, { recordId: row.id, function: fn, fields: this.fields() }).subscribe((result) => {
        if (result?.confirmed) {
          this.loadRecords();
        }
      });
      return;
    }

    this.loading.set(true);
    this.service
      .executeCustomEntityRecordFunction(row.id, fn.key, { inputs: [] })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.functionExecuted);
          this.loadRecords();
        },
      });
  }

  private canExecuteFunction(row: Row, fn: CustomFunctionResponse): boolean {
    const allowedStatusValidation = fn.validations.find((validation) =>
      validation.source === 'Entity' &&
      validation.operator === 'Equals' &&
      validation.fieldKey === 'customStatusId'
    );

    if (allowedStatusValidation?.expectedValue && row.customStatusId !== allowedStatusValidation.expectedValue) {
      return false;
    }

    const updateStatusStep = fn.steps.find((step) => step.type === 'UpdateStatus');

    if (!updateStatusStep) {
      return true;
    }

    const targetStatus = this.statuses().find((status) => status.key === updateStatusStep.valueExpression);

    if (!targetStatus || !row.customStatusId) {
      return false;
    }

    return this.statusTransitions().some((transition) =>
      transition.isActive &&
      transition.fromStatusId === row.customStatusId &&
      transition.toStatusId === targetStatus.id,
    );
  }

  private deleteRecord(row: Row): void {
    this.dialog.confirm({
      title: this.literals().dialogs.deleteTitle,
      message: this.literals().dialogs.deleteMessage.replace('{name}', row.name),
      confirm: () => {
        this.loading.set(true);
        this.service
          .deleteCustomEntityRecord(row.id)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: () => {
              this.notification.success(this.literals().notifications.deleted);
              this.loadRecords();
            },
          });
      },
    });
  }

  private toRow(item: CustomEntityRecordResponse): Row {
    const row: Row = { ...item };

    for (const field of item.customFields) {
      row[`field_${field.key}`] = field.displayValue ?? field.value;
    }

    return row;
  }
}
