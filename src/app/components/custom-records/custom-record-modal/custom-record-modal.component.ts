import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customRecordsLiterals } from '@i18n/custom-records/custom-records.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomEntityRecordResponse } from '@models/customization/responses/custom-entity-record.response';
import { CustomEntityResponse } from '@models/customization/responses/custom-entity.response';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import { CustomFieldType } from '@models/customization/types/custom-field-type.enum';
import { PoFieldModule, PoModalAction, PoModalModule, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { CustomizationService } from '@services/customization/customization.service';
import { finalize, Observable } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-custom-record-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule],
  templateUrl: './custom-record-modal.component.html',
})
export class CustomRecordModalComponent
  extends BaseModalComponent<
    { entity: CustomEntityResponse; fields: CustomFieldResponse[]; item?: CustomEntityRecordResponse },
    { confirmed: boolean }
  >
  implements OnInit
{
  private readonly service = inject(CustomizationService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(customRecordsLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly fieldType = CustomFieldType;

  readonly fields = computed(() => (this.data?.fields ?? []).filter((field) => field.isActive).sort((a, b) => a.displayOrder - b.displayOrder));

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    values: this.formBuilder.nonNullable.group({}),
  });

  readonly formInvalid = formInvalidSignal(this.form);
  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: () => this.save(),
    loading: this.loading(),
    disabled: this.formInvalid(),
  }));
  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: () => this.close(),
    loading: this.loading(),
  }));

  ngOnInit(): void {
    for (const field of this.fields()) {
      this.form.controls.values.addControl(
        field.key,
        this.formBuilder.nonNullable.control('', field.isRequired ? [Validators.required] : []),
      );
    }

    if (!this.data?.item) {
      return;
    }

    const values = Object.fromEntries(this.data.item.customFields.map((field) => [field.key, field.value ?? '']));
    this.form.reset({
      name: this.data.item.name,
      values,
    });
  }

  options(field: CustomFieldResponse): PoSelectOption[] {
    return field.options.map((option) => ({ label: option, value: option }));
  }

  save(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const customFields = Object.entries(raw.values)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([fieldKey, value]) => ({ fieldKey, value: String(value) }));

    const request = {
      key: this.data?.item?.key,
      name: raw.name,
      customFields,
    };

    const operation: Observable<string | void> = this.data?.item
      ? this.service.updateCustomEntityRecord(this.data.item.id, request)
      : this.service.createCustomEntityRecord(this.data!.entity.id, request);

    this.loading.set(true);
    operation.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.notification.success(this.data?.item ? this.literals().notifications.updated : this.literals().notifications.created);
        this.submit({ confirmed: true });
      },
    });
  }
}
