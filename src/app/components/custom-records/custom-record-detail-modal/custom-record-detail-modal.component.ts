import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customRecordsLiterals } from '@i18n/custom-records/custom-records.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomEntityRecordResponse } from '@models/customization/responses/custom-entity-record.response';
import { CustomStatusResponse } from '@models/customization/responses/custom-status.response';
import { PoModalAction, PoModalModule } from '@po-ui/ng-components';
import { CustomizationService } from '@services/customization/customization.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-custom-record-detail-modal',
  standalone: true,
  imports: [CommonModule, PoModalModule],
  templateUrl: './custom-record-detail-modal.component.html',
})
export class CustomRecordDetailModalComponent
  extends BaseModalComponent<{ recordId: string; statuses: CustomStatusResponse[] }, void>
  implements OnInit
{
  private readonly service = inject(CustomizationService);

  readonly literals = injectI18n(customRecordsLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);
  readonly record = signal<CustomEntityRecordResponse | null>(null);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().close,
    action: this.close.bind(this),
  }));

  ngOnInit(): void {
    this.loadRecord();
  }

  displayValue(value?: string | null): string {
    return value?.trim() ? value : this.common().notInformed;
  }

  statusName(statusId?: string | null): string {
    if (!statusId) {
      return this.common().notInformed;
    }

    return this.data?.statuses.find((status) => status.id === statusId)?.name ?? statusId;
  }

  private loadRecord(): void {
    this.loading.set(true);

    this.service
      .getCustomEntityRecordById(this.data!.recordId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (record) => this.record.set(record),
      });
  }
}
