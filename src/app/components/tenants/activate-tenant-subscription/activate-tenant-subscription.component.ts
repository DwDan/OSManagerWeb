import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { tenantsLiterals } from '@i18n/tenants/tenants.literals';
import { PlanListItemResponse } from '@models/plans/responses/plan-list-item.response';
import { ActivateTenantSubscriptionRequest } from '@models/tenants/requests/activate-tenant-subscription.request';
import {
  PoButtonModule,
  PoDatepickerModule,
  PoFieldModule,
  PoModalModule,
  PoNotificationService,
} from '@po-ui/ng-components';
import { PlansService } from '@services/plans/plans.service';
import { TenantsService } from '@services/tenants/tenants.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-activate-tenant-subscription',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoModalModule,
    PoFieldModule,
    PoDatepickerModule,
    PoButtonModule,
  ],
  templateUrl: './activate-tenant-subscription.component.html',
})
export class ActivateTenantSubscriptionComponent extends BaseModalComponent<
  { tenantId: string },
  { confirmed: boolean }
> {
  private readonly fb = inject(FormBuilder);
  private readonly tenantsService = inject(TenantsService);
  private readonly plansService = inject(PlansService);
  private readonly poNotification = inject(PoNotificationService);

  readonly literals = injectI18n(tenantsLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);
  readonly plans = signal<PlanListItemResponse[]>([]);

  readonly planOptions = signal<{ label: string; value: string }[]>([]);

  readonly form = this.fb.nonNullable.group({
    planId: ['', Validators.required],
    subscriptionEndsAtUtc: ['', Validators.required],
    externalCustomerId: [''],
    externalSubscriptionId: [''],
  });

  ngOnInit(): void {
    this.loadPlans();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const formValue = this.form.getRawValue();

    const request: ActivateTenantSubscriptionRequest = {
      planId: formValue.planId,
      subscriptionEndsAtUtc: new Date(formValue.subscriptionEndsAtUtc),
      externalCustomerId: formValue.externalCustomerId,
      externalSubscriptionId: formValue.externalSubscriptionId,
    };

    this.tenantsService
      .activateSubscription(this.data?.tenantId!, request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.subscriptionActivated);
          this.submit({ confirmed: true });
        },
      });
  }

  private loadPlans(): void {
    this.loading.set(true);

    this.plansService
      .getAllPlans()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (plans) => {
          this.plans.set(plans);

          this.planOptions.set(
            plans
              .filter((p) => p.isActive)
              .map((p) => ({
                label: p.name,
                value: p.id,
              })),
          );
        },
      });
  }
}
