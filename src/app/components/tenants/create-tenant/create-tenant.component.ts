import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { tenantsLiterals } from '@i18n/tenants/tenants.literals';
import { PlanListItemResponse } from '@models/plans/responses/plan-list-item.response';
import { CreateTenantRequest } from '@models/tenants/requests/create-tenant.request';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
  PoModalModule,
  PoNotificationService,
  PoSelectOption,
} from '@po-ui/ng-components';
import { PlansService } from '@services/plans/plans.service';
import { TenantsService } from '@services/tenants/tenants.service';
import { finalize } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-create-tenant',
  templateUrl: './create-tenant.component.html',
  styleUrl: './create-tenant.component.scss',
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule, PoButtonModule],
})
export class CreateTenantComponent extends BaseModalComponent<{}, { confirmed: boolean }> {
  private readonly tenantsService = inject(TenantsService);
  private readonly plansService = inject(PlansService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(tenantsLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly plans = signal<PoSelectOption[]>([]);

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
    slug: ['', [Validators.required]],
    planId: ['', [Validators.required]],
    document: [''],
    email: [''],
    phoneNumber: [''],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  ngOnInit(): void {
    this.loadPlans();
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.formInvalid()) {
      return;
    }

    const request: CreateTenantRequest = {
      name: this.form.controls.name.getRawValue(),
      slug: this.form.controls.slug.getRawValue(),
      planId: this.form.controls.planId.getRawValue(),
      document: this.form.controls.document.getRawValue() || undefined,
      email: this.form.controls.email.getRawValue() || undefined,
      phoneNumber: this.form.controls.phoneNumber.getRawValue() || undefined,
    };

    this.loading.set(true);

    this.tenantsService
      .create(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.created);
          this.submit({ confirmed: true });
        },
      });
  }

  private loadPlans(): void {
    this.plansService.getAllPlans().subscribe({
      next: (plans: PlanListItemResponse[]) => {
        this.plans.set(
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
