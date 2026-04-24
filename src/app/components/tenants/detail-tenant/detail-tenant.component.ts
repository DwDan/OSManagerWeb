import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { tenantsLiterals } from '@i18n/tenants/tenants.literals';
import { TenantDetailsResponse } from '@models/tenants/responses/tenant-details.response';
import { TenantSubscriptionResponse } from '@models/tenants/responses/tenant-subscription.response';
import { SubscriptionStatus } from '@models/tenants/types/subscription-status.enum';
import { TenantStatus } from '@models/tenants/types/tenant-status.enum';
import {
  PoButtonModule,
  PoFieldModule,
  PoInfoModule,
  PoModalAction,
  PoModalModule,
  PoPageModule,
  PoTagModule,
} from '@po-ui/ng-components';
import { TenantsService } from '@services/tenants/tenants.service';
import { finalize } from 'rxjs';

type TenantTagViewModel = {
  label: string;
  color: string;
  icon: string;
};

@Component({
  selector: 'app-detail-tenant',
  imports: [
    CommonModule,
    FormsModule,
    PoPageModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule,
    PoTagModule,
    PoInfoModule,
  ],
  templateUrl: './detail-tenant.component.html',
  styleUrl: './detail-tenant.component.scss',
})
export class DetailTenantComponent extends BaseModalComponent<{ tenantId: string }, {}> {
  private readonly tenantsService = inject(TenantsService);

  readonly literals = injectI18n(tenantsLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly selectedTenant = signal<TenantDetailsResponse | null>(null);
  readonly subscriptions = signal<TenantSubscriptionResponse[]>([]);
  readonly loadingSubscriptions = signal(false);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().close,
    action: this.close.bind(this),
  }));

  ngOnInit(): void {
    const tenantId = this.data!.tenantId;

    this.openDetails(tenantId);
    this.loadSubscriptions(tenantId);
  }

  openDetails(id: string): void {
    this.loading.set(true);

    this.tenantsService
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (tenant) => {
          this.selectedTenant.set(tenant);
        },
      });
  }

  private loadSubscriptions(id: string): void {
    this.loadingSubscriptions.set(true);

    this.tenantsService
      .getSubscriptions(id)
      .pipe(finalize(() => this.loadingSubscriptions.set(false)))
      .subscribe({
        next: (subscriptions) => {
          this.subscriptions.set(subscriptions);
        },
      });
  }

  getStatusTag(status: TenantStatus): TenantTagViewModel {
    switch (status) {
      case TenantStatus.Pending:
        return { label: this.literals().status.pending, color: 'color-07', icon: 'an an-clock' };
      case TenantStatus.Trial:
        return { label: this.literals().status.trial, color: 'color-08', icon: 'an an-star' };
      case TenantStatus.Active:
        return { label: this.literals().status.active, color: 'color-12', icon: 'an an-check' };
      case TenantStatus.Suspended:
        return { label: this.literals().status.suspended, color: 'color-01', icon: 'an an-pause' };
      case TenantStatus.Expired:
        return { label: this.literals().status.expired, color: 'color-05', icon: 'an an-warning' };
      case TenantStatus.Canceled:
        return { label: this.literals().status.canceled, color: 'color-13', icon: 'an an-x' };
      default:
        return { label: String(status), color: '', icon: '' };
    }
  }

  getSubscriptionStatusLabel(status: SubscriptionStatus): string {
    switch (status) {
      case SubscriptionStatus.Active:
        return this.literals().subscriptionStatus.active;
      case SubscriptionStatus.PastDue:
        return this.literals().subscriptionStatus.pastDue;
      case SubscriptionStatus.Canceled:
        return this.literals().subscriptionStatus.canceled;
      case SubscriptionStatus.Expired:
        return this.literals().subscriptionStatus.expired;
      case SubscriptionStatus.Trial:
        return this.literals().subscriptionStatus.trialing;
      default:
        return '';
    }
  }
}
