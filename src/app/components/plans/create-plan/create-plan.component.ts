import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { plansLiterals } from '@i18n/plans/plans.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CreatePlanRequest } from '@models/plans/requests/create-plan.request';
import {
  PoFieldModule,
  PoModalAction,
  PoModalModule,
  PoNotificationService,
  PoSwitchModule,
} from '@po-ui/ng-components';
import { PlansService } from '@services/plans/plans.service';
import { finalize } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, PoModalModule, PoSwitchModule],
})
export class CreatePlanComponent extends BaseModalComponent<void, { confirmed: boolean }> {
  private readonly plansService = inject(PlansService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(plansLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: this.save.bind(this),
    loading: this.loading(),
    disabled: this.formInvalid(),
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: this.close.bind(this),
    loading: this.loading(),
  }));

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    code: ['', [Validators.required]],
    price: [0, [Validators.required]],
    maxAdminUsers: [1, [Validators.required]],
    maxOrdersPerMonth: [0],
    isPublic: [true],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  save(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();

    const request: CreatePlanRequest = {
      name: rawValue.name,
      code: rawValue.code,
      price: rawValue.price,
      maxAdminUsers: rawValue.maxAdminUsers,
      maxOrdersPerMonth: rawValue.maxOrdersPerMonth || undefined,
      isPublic: rawValue.isPublic,
    };

    this.loading.set(true);

    this.plansService
      .create(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.created);
          this.submit({ confirmed: true });
        },
      });
  }
}
