import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customRecordsLiterals } from '@i18n/custom-records/custom-records.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomFunctionResponse } from '@models/customization/responses/custom-function.response';
import { CustomFieldType } from '@models/customization/types/custom-field-type.enum';
import { PoFieldModule, PoModalAction, PoModalModule, PoNotificationService } from '@po-ui/ng-components';
import { CustomizationService } from '@services/customization/customization.service';
import { finalize } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-custom-function-execute-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule],
  templateUrl: './custom-function-execute-modal.component.html',
})
export class CustomFunctionExecuteModalComponent
  extends BaseModalComponent<{ recordId: string; function: CustomFunctionResponse }, { confirmed: boolean }>
  implements OnInit
{
  private readonly service = inject(CustomizationService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(customRecordsLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly fieldType = CustomFieldType;
  readonly inputs = computed(() => [...(this.data?.function.inputs ?? [])].sort((a, b) => a.displayOrder - b.displayOrder));

  readonly form = this.formBuilder.nonNullable.group({});
  readonly formInvalid = formInvalidSignal(this.form);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().send,
    action: () => this.execute(),
    loading: this.loading(),
    disabled: this.formInvalid(),
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: () => this.close(),
    loading: this.loading(),
  }));

  ngOnInit(): void {
    for (const input of this.inputs()) {
      this.form.addControl(
        input.key,
        this.formBuilder.nonNullable.control('', input.isRequired ? [Validators.required] : []),
      );
    }
  }

  execute(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }

    const inputs = Object.entries(this.form.getRawValue())
      .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
      .map(([key, value]) => ({ key, value: String(value) }));

    this.loading.set(true);
    this.service
      .executeCustomEntityRecordFunction(this.data!.recordId, this.data!.function.key, { inputs })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.functionExecuted);
          this.submit({ confirmed: true });
        },
      });
  }
}
