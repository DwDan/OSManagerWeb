import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '@components/shared/pagination/pagination.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { tenantsLiterals } from '@i18n/tenants/tenants.literals';
import { GetPagedTenantsRequest } from '@models/tenants/requests/get-paged-tenants.request';
import { TenantPagedItemResponse } from '@models/tenants/responses/tenant-paged-item.response';
import { TenantStatus } from '@models/tenants/types/tenant-status.enum';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
} from '@po-ui/ng-components';
import { DevicesService } from '@services/devices/devices.service';
import { ModalService } from '@services/modal/modal.service';
import { TenantsService } from '@services/tenants/tenants.service';
import { finalize } from 'rxjs';
import { ActivateTenantSubscriptionComponent } from './activate-tenant-subscription/activate-tenant-subscription.component';
import { CreateTenantComponent } from './create-tenant/create-tenant.component';
import { DetailTenantComponent } from './detail-tenant/detail-tenant.component';
import { FilterTenantComponent } from './filter-tenant/filter-tenant.component';
import { StartTenantTrialComponent } from './start-tenant-trial/start-tenant-trial.component';
import { TenantListViewComponent } from './tenant-list-view/tenant-list-view.component';
import { UpdateTenantComponent } from './update-tenant/update-tenant.component';

@Component({
  selector: 'app-tenants',
  imports: [
    CommonModule,
    FormsModule,
    PoTableModule,
    PoPageModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule,
    PaginationComponent,
    FilterTenantComponent,
    TenantListViewComponent,
  ],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss',
})
export class TenantsComponent implements OnInit {
  private readonly tenantsService = inject(TenantsService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly modalService = inject(ModalService);
  readonly devicesService = inject(DevicesService);

  @ViewChild(FilterTenantComponent) filterComponent!: FilterTenantComponent;

  readonly literals = injectI18n(tenantsLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly spacing = PoTableColumnSpacing;

  readonly loading = signal(false);

  readonly page = signal<number>(0);
  readonly pageSize = signal<number>(0);
  readonly totalItems = signal<number>(0);
  readonly items = signal<TenantPagedItemResponse[]>([]);

  readonly request = signal<GetPagedTenantsRequest>({ page: 1, pageSize: 10 });

  readonly pageActions = computed<PoPageAction[]>(() => {
    const actions: PoPageAction[] = [];

    if (this.devicesService.isMobile()) {
      actions.push({
        label: this.common().filters,
        icon: 'an an-funnel',
        action: () => this.openFilters(),
        disabled: this.loading(),
      });
    }

    actions.push({
      label: this.literals().pageActions.newTenant,
      icon: 'an an-plus',
      type: 'primary',
      action: () => this.openCreateModal(),
      disabled: this.loading(),
    });

    return actions;
  });

  readonly tableActions = computed<PoTableAction[]>(() => [
    {
      label: this.literals().tableActions.details,
      action: (row: TenantPagedItemResponse) => this.openDetails(row.id),
    },
    {
      label: this.literals().tableActions.edit,
      action: (row: TenantPagedItemResponse) => this.openEditModal(row.id),
      visible: (row: TenantPagedItemResponse) => row.status !== TenantStatus.Canceled,
    },
    {
      label: this.literals().tableActions.suspend,
      action: (row: TenantPagedItemResponse) => this.suspend(row.id),
      visible: (row: TenantPagedItemResponse) =>
        row.status === TenantStatus.Active || row.status === TenantStatus.Trial,
    },
    {
      label: this.literals().tableActions.cancel,
      action: (row: TenantPagedItemResponse) => this.cancel(row.id),
      visible: (row: TenantPagedItemResponse) =>
        row.status !== TenantStatus.Canceled && row.status !== TenantStatus.Pending,
    },
    {
      label: this.literals().tableActions.expire,
      action: (row: TenantPagedItemResponse) => this.expire(row.id),
      visible: (row: TenantPagedItemResponse) =>
        row.status === TenantStatus.Active ||
        row.status === TenantStatus.Trial ||
        row.status === TenantStatus.Suspended,
    },
    {
      label: this.literals().tableActions.markPastDue,
      action: (row: TenantPagedItemResponse) => this.markPastDue(row.id),
      visible: (row: TenantPagedItemResponse) => row.status === TenantStatus.Active,
    },
    {
      label: this.literals().tableActions.startTrial,
      action: (row: TenantPagedItemResponse) => this.openStartTrialModal(row.id),
      visible: (row: TenantPagedItemResponse) => row.status === TenantStatus.Pending,
    },
    {
      label: this.literals().tableActions.activateSubscription,
      action: (row: TenantPagedItemResponse) => this.openActivateSubscriptionModal(row.id),
      visible: (row: TenantPagedItemResponse) =>
        row.status === TenantStatus.Pending ||
        row.status === TenantStatus.Trial ||
        row.status === TenantStatus.Suspended ||
        row.status === TenantStatus.Expired,
    },
  ]);

  readonly columns = computed<PoTableColumn[]>(() => [
    { property: 'name', label: this.literals().columns.name },
    { property: 'slug', label: this.literals().columns.slug },
    { property: 'document', label: this.literals().columns.document },
    { property: 'email', label: this.literals().columns.email },
    { property: 'phoneNumber', label: this.literals().columns.phoneNumber },
    {
      property: 'status',
      label: this.literals().columns.status,
      type: 'label',
      labels: [
        {
          value: TenantStatus.Pending,
          color: 'color-07',
          label: this.literals().status.pending,
          icon: 'an an-clock',
        },
        {
          value: TenantStatus.Trial,
          color: 'color-08',
          label: this.literals().status.trial,
          icon: 'an an-star',
        },
        {
          value: TenantStatus.Active,
          color: 'color-12',
          label: this.literals().status.active,
          icon: 'an an-check',
        },
        {
          value: TenantStatus.Suspended,
          color: 'color-01',
          label: this.literals().status.suspended,
          icon: 'an an-pause',
        },
        {
          value: TenantStatus.Expired,
          color: 'color-05',
          label: this.literals().status.expired,
          icon: 'an an-warning',
        },
        {
          value: TenantStatus.Canceled,
          color: 'color-13',
          label: this.literals().status.canceled,
          icon: 'an an-x',
        },
      ],
    },
    { property: 'currentPlanName', label: this.literals().columns.currentPlan },
    {
      property: 'createdAtUtc',
      label: this.literals().columns.createdAtUtc,
      type: 'date',
      format: 'dd/MM/yyyy HH:mm',
    },
    {
      property: 'subscriptionEndsAtUtc',
      label: this.literals().columns.subscriptionEndsAtUtc,
      type: 'date',
      format: 'dd/MM/yyyy HH:mm',
    },
  ]);

  ngOnInit(): void {
    this.loadData();
  }

  openFilters(): void {
    this.filterComponent.openMobileFilters();
  }

  openCreateModal(): void {
    this.modalService.open(CreateTenantComponent, {}).subscribe((result) => {
      if (!result?.confirmed) {
        return;
      }

      this.loadData();
    });
  }

  openEditModal(id: string): void {
    this.modalService.open(UpdateTenantComponent, { tenantId: id }).subscribe((result) => {
      if (!result?.confirmed) {
        return;
      }

      this.loadData();
    });
  }

  openDetails(id: string): void {
    this.modalService.open(DetailTenantComponent, { tenantId: id });
  }

  openStartTrialModal(id: string): void {
    this.modalService.open(StartTenantTrialComponent, { tenantId: id }).subscribe((result) => {
      if (!result?.confirmed) {
        return;
      }

      this.loadData();
    });
  }

  openActivateSubscriptionModal(id: string): void {
    this.modalService
      .open(ActivateTenantSubscriptionComponent, { tenantId: id })
      .subscribe((result) => {
        if (!result?.confirmed) {
          return;
        }

        this.loadData();
      });
  }

  suspend(id: string): void {
    this.loading.set(true);

    this.tenantsService
      .suspend(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.suspended);
          this.loadData();
        },
      });
  }

  cancel(id: string): void {
    this.loading.set(true);

    this.tenantsService
      .cancel(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.canceled);
          this.loadData();
        },
      });
  }

  expire(id: string): void {
    this.loading.set(true);

    this.tenantsService
      .expire(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.expired);
          this.loadData();
        },
      });
  }

  markPastDue(id: string): void {
    this.loading.set(true);

    this.tenantsService
      .markSubscriptionAsPastDue(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.pastDue);
          this.loadData();
        },
      });
  }

  private loadData(): void {
    this.loading.set(true);

    this.tenantsService
      .getTenants(this.request())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.page.set(response.page);
          this.pageSize.set(response.pageSize);
          this.totalItems.set(response.totalItems);
          this.items.set(response.items);
        },
      });
  }

  onFilterChange(filter: Partial<GetPagedTenantsRequest>): void {
    this.request.set({
      ...this.request(),
      ...filter,
      page: 1,
    });

    this.loadData();
  }

  onPageChange(page: number): void {
    this.request.set({ ...this.request(), page });
    this.loadData();
  }

  onPageSizeChange(pageSize: number): void {
    this.request.set({ ...this.request(), pageSize });
    this.loadData();
  }
}
