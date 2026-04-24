import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { tenantsLiterals } from '@i18n/tenants/tenants.literals';
import { PlanListItemResponse } from '@models/plans/responses/plan-list-item.response';
import { StartTenantTrialRequest } from '@models/tenants/requests/start-tenant-trial.request';
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
  selector: 'app-start-tenant-trial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoModalModule,
    PoFieldModule,
    PoDatepickerModule,
    PoButtonModule,
  ],
  templateUrl: './start-tenant-trial.component.html',
})
export class StartTenantTrialComponent extends BaseModalComponent<
  { tenantId: string },
  { confirmed: boolean }
> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly tenantsService = inject(TenantsService);
  private readonly plansService = inject(PlansService);
  private readonly poNotification = inject(PoNotificationService);

  readonly literals = injectI18n(tenantsLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);
  readonly plans = signal<PlanListItemResponse[]>([]);

  readonly form = this.formBuilder.nonNullable.group({
    planId: ['', Validators.required],
    trialEndsAtUtc: ['', Validators.required],
  });

  readonly planOptions = signal<{ label: string; value: string }[]>([]);

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

    const request: StartTenantTrialRequest = {
      planId: formValue.planId,
      trialEndsAtUtc: new Date(formValue.trialEndsAtUtc),
    };

    this.tenantsService
      .startTrial(this.data?.tenantId!, request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.trialStarted);
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
              .filter((plan) => plan.isActive)
              .map((plan) => ({
                label: plan.name,
                value: plan.id,
              })),
          );
        },
      });
  }
}
