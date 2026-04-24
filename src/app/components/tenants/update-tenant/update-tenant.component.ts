import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { tenantsLiterals } from '@i18n/tenants/tenants.literals';
import { UpdateTenantRequest } from '@models/tenants/requests/update-tenant.request';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
  PoModalModule,
  PoNotificationService,
} from '@po-ui/ng-components';
import { TenantsService } from '@services/tenants/tenants.service';
import { finalize } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-update-tenant',
  templateUrl: './update-tenant.component.html',
  styleUrl: './update-tenant.component.scss',
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule, PoButtonModule],
})
export class UpdateTenantComponent extends BaseModalComponent<
  { tenantId: string },
  { confirmed: boolean }
> {
  private readonly tenantsService = inject(TenantsService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(tenantsLiterals);
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
    slug: ['', [Validators.required]],
    document: [''],
    email: [''],
    phoneNumber: [''],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    this.tenantsService
      .getById(this.data!.tenantId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (tenant) => {
          this.form.patchValue({
            name: tenant.name,
            slug: tenant.slug,
            document: tenant.document ?? '',
            email: tenant.email ?? '',
            phoneNumber: tenant.phoneNumber ?? '',
          });
        },
      });
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.formInvalid()) {
      return;
    }

    const request: UpdateTenantRequest = {
      name: this.form.controls.name.getRawValue(),
      slug: this.form.controls.slug.getRawValue(),
      document: this.form.controls.document.getRawValue() || undefined,
      email: this.form.controls.email.getRawValue() || undefined,
      phoneNumber: this.form.controls.phoneNumber.getRawValue() || undefined,
    };

    this.loading.set(true);

    this.tenantsService
      .update(this.data!.tenantId, request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.updated);
          this.submit({ confirmed: true });
        },
      });
  }
}
