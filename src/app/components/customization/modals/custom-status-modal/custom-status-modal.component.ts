import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customizationLiterals } from '@i18n/customization/customization.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomStatusResponse } from '@models/customization/responses/custom-status.response';
import { PoFieldModule, PoModalAction, PoModalModule, PoNotificationService, PoSwitchModule } from '@po-ui/ng-components';
import { CustomizationService } from '@services/customization/customization.service';
import { finalize, Observable } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-custom-status-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule, PoSwitchModule],
  templateUrl: './custom-status-modal.component.html',
})
export class CustomStatusModalComponent
  extends BaseModalComponent<{ entityName: string; customEntityId?: string | null; item?: CustomStatusResponse }, { confirmed: boolean }>
  implements OnInit
{
  private readonly service = inject(CustomizationService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);
  readonly literals = injectI18n(customizationLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    key: ['', [Validators.required]],
    name: ['', [Validators.required]],
    color: ['#0C9ABE'],
    displayOrder: [1, [Validators.required]],
    isInitial: [false],
    isFinal: [false],
    isCanceled: [false],
  });
  readonly formInvalid = formInvalidSignal(this.form);
  readonly primaryAction = computed<PoModalAction>(() => ({ label: this.common().save, action: () => this.save(), loading: this.loading(), disabled: this.formInvalid() }));
  readonly secondaryAction = computed<PoModalAction>(() => ({ label: this.common().cancel, action: () => this.close(), loading: this.loading() }));

  ngOnInit(): void {
    const item = this.data?.item;
    if (item) {
      this.form.reset({ key: item.key, name: item.name, color: item.color ?? '', displayOrder: item.displayOrder, isInitial: item.isInitial, isFinal: item.isFinal, isCanceled: item.isCanceled });
    }
  }

  save(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const operation: Observable<string | void> = this.data?.item
      ? this.service.updateStatus(this.data.item.id, { ...raw, color: raw.color || null, isActive: this.data.item.isActive })
      : this.service.createStatus({ ...raw, color: raw.color || null, entityName: this.data!.entityName, customEntityId: this.data?.customEntityId ?? null });
    this.loading.set(true);
    operation.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.notification.success(this.data?.item ? this.literals().notifications.updated : this.literals().notifications.created);
        this.submit({ confirmed: true });
      },
    });
  }
}
