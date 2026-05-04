import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customizationLiterals } from '@i18n/customization/customization.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomStatusResponse } from '@models/customization/responses/custom-status.response';
import { PoFieldModule, PoModalAction, PoModalModule, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { CustomizationService } from '@services/customization/customization.service';
import { finalize } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-custom-status-transition-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule],
  templateUrl: './custom-status-transition-modal.component.html',
})
export class CustomStatusTransitionModalComponent extends BaseModalComponent<
  { entityName: string; customEntityId?: string | null; statuses: CustomStatusResponse[] },
  { confirmed: boolean }
> {
  private readonly service = inject(CustomizationService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(customizationLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly statusOptions = computed<PoSelectOption[]>(() =>
    (this.data?.statuses ?? []).map((status) => ({
      label: status.name,
      value: status.id,
    })),
  );

  readonly form = this.formBuilder.nonNullable.group({
    fromStatusId: ['', [Validators.required]],
    toStatusId: ['', [Validators.required]],
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

  save(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    this.loading.set(true);
    this.service
      .createStatusTransition({
        entityName: this.data!.entityName,
        customEntityId: this.data?.customEntityId ?? null,
        fromStatusId: raw.fromStatusId,
        toStatusId: raw.toStatusId,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.created);
          this.submit({ confirmed: true });
        },
      });
  }
}
