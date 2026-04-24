import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { plansLiterals } from '@i18n/plans/plans.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { UpdatePlanRequest } from '@models/plans/requests/update-plan.request';
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
  selector: 'app-update-plan',
  templateUrl: './update-plan.component.html',
  styleUrls: ['./update-plan.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, PoModalModule, PoSwitchModule],
})
export class UpdatePlanComponent extends BaseModalComponent<
  { planId: string },
  { confirmed: boolean }
> {
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
    price: [0, [Validators.required]],
    maxAdminUsers: [1, [Validators.required]],
    maxOrdersPerMonth: [0],
    isPublic: [true],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  ngOnInit(): void {
    this.loadData();
  }

  save(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();

    const request: UpdatePlanRequest = {
      name: rawValue.name,
      price: rawValue.price,
      maxAdminUsers: rawValue.maxAdminUsers,
      maxOrdersPerMonth: rawValue.maxOrdersPerMonth || undefined,
      isPublic: rawValue.isPublic,
    };

    this.loading.set(true);

    this.plansService
      .update(this.data!.planId, request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.updated);
          this.submit({ confirmed: true });
        },
      });
  }

  private loadData(): void {
    this.loading.set(true);

    this.plansService
      .getAllPlans()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (plans) => {
          const plan = plans.find((item) => item.id === this.data!.planId);

          if (!plan) {
            return;
          }

          this.form.reset({
            name: plan.name,
            price: plan.price,
            maxAdminUsers: plan.maxAdminUsers,
            maxOrdersPerMonth: plan.maxOrdersPerMonth ?? 0,
            isPublic: plan.isPublic,
          });
        },
      });
  }
}
