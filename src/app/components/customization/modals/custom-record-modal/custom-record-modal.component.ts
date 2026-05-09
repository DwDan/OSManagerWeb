import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customizationLiterals } from '@i18n/customization/customization.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomEntityRecordResponse } from '@models/customization/responses/custom-entity-record.response';
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
    { customEntityId: string; customEntityOptions: PoSelectOption[]; item?: CustomEntityRecordResponse },
    { confirmed: boolean; customEntityId: string }
  >
  implements OnInit
{
  private readonly service = inject(CustomizationService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);
  readonly literals = injectI18n(customizationLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    customEntityId: ['', [Validators.required]],
    key: [''],
    name: ['', [Validators.required]],
    values: [''],
  });
  readonly formInvalid = formInvalidSignal(this.form);
  readonly primaryAction = computed<PoModalAction>(() => ({ label: this.common().save, action: () => this.save(), loading: this.loading(), disabled: this.formInvalid() }));
  readonly secondaryAction = computed<PoModalAction>(() => ({ label: this.common().cancel, action: () => this.close(), loading: this.loading() }));

  ngOnInit(): void {
    const item = this.data?.item;
    this.form.controls.customEntityId.setValue(this.data?.customEntityId ?? '');

    if (item) {
      this.form.reset({
        customEntityId: item.customEntityId,
        key: item.key,
        name: item.name,
        values: item.customFields.map((x) => `${x.key}=${x.value ?? ''}`).join('\n'),
      });
      this.form.controls.customEntityId.disable();
    }
  }

  save(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const request = { name: raw.name, customFields: this.parseValues(raw.values) };
    const operation: Observable<string | void> = this.data?.item
      ? this.service.updateCustomEntityRecord(this.data.item.id, request)
      : this.service.createCustomEntityRecord(raw.customEntityId, request);
    this.loading.set(true);
    operation.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.notification.success(this.data?.item ? this.literals().notifications.updated : this.literals().notifications.created);
        this.submit({ confirmed: true, customEntityId: raw.customEntityId });
      },
    });
  }

  private parseValues(value: string): { fieldKey: string; value: string }[] {
    return value.split('\n').map((line) => line.trim()).filter((line) => line.includes('=')).map((line) => {
      const index = line.indexOf('=');
      return { fieldKey: line.substring(0, index).trim(), value: line.substring(index + 1).trim() };
    });
  }
}
