import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { AppPageAction, PageComponent } from '@components/shared/page-default/page.component';
import { PaginationComponent } from '@components/shared/pagination/pagination.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customersLiterals } from '@i18n/customers/customers.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { GerCustomersRequest } from '@models/customers/requests/get-customers.request';
import { CustomerListItemResponse } from '@models/customers/responses/customer-list-item.response';
import { GerServicesRequest } from '@models/services/requests/get-services.request';
import {
  PoPageModule,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
} from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { DevicesService } from '@services/devices/devices.service';
import { ModalService } from '@services/modal/modal.service';
import { finalize } from 'rxjs';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';
import { FilterCustomerComponent } from './filter-customer/filter-customer.component';
import { UpdateCustomerComponent } from './update-customer/update-customer.component';

@Component({
  selector: 'app-customers',
  imports: [
    CommonModule,
    PoTableModule,
    PoPageModule,
    PaginationComponent,
    FilterCustomerComponent,
    PageComponent,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  private readonly customersService = inject(CustomersService);
  private readonly modalService = inject(ModalService);
  private readonly devicesService = inject(DevicesService);

  @ViewChild(FilterCustomerComponent) filterComponent!: FilterCustomerComponent;

  readonly literals = injectI18n(customersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly spacing = PoTableColumnSpacing;

  readonly loading = signal(false);

  readonly page = signal<number>(0);
  readonly pageSize = signal<number>(0);
  readonly totalItems = signal<number>(0);
  readonly items = signal<CustomerListItemResponse[]>([]);

  readonly request = signal<GerCustomersRequest>({ page: 1, pageSize: 10 });

  readonly pageActions = computed<AppPageAction[]>(() => {
    const actions: AppPageAction[] = [
      {
        label: this.literals().pageActions.newCustomer,
        icon: 'an an-plus',
        action: () => this.openCreateModal(),
      },
    ];

    if (this.devicesService.isMobile()) {
      actions.push({
        label: this.common().filters,
        icon: 'an an-funnel',
        action: () => this.openFilters(),
      });
    }

    return actions;
  });

  readonly tableActions = computed<PoTableAction[]>(() => [
    {
      label: this.literals().tableActions.details,
      action: (row: CustomerListItemResponse) => this.openDetails(row.id),
    },
    {
      label: this.literals().tableActions.edit,
      action: (row: CustomerListItemResponse) => this.openEditModal(row.id),
    },
  ]);

  readonly columns = computed<PoTableColumn[]>(() => [
    { property: 'name', label: this.literals().columns.customer },
    { property: 'phone', label: this.literals().columns.phone },
    { property: 'email', label: this.literals().columns.email },
    { property: 'city', label: this.literals().columns.city },
    { property: 'state', label: this.literals().columns.state },
  ]);

  ngOnInit(): void {
    this.loadCustomers();
  }

  openFilters(): void {
    this.filterComponent.openMobileFilters();
  }

  openCreateModal(): void {
    this.modalService.open(CreateCustomerComponent).subscribe((result) => {
      if (result?.confirmed) {
        this.loadCustomers();
      }
    });
  }

  openEditModal(id: string): void {
    this.modalService.open(UpdateCustomerComponent, { customerId: id }).subscribe((result) => {
      if (result?.confirmed) {
        this.loadCustomers();
      }
    });
  }

  openDetails(id: string): void {
    this.modalService.open(DetailCustomerComponent, { customerId: id });
  }

  private loadCustomers(): void {
    this.loading.set(true);

    this.customersService
      .getCustomers(this.request())
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

  onFilterChange(filter: Partial<GerServicesRequest>): void {
    this.request.set({
      ...this.request(),
      ...filter,
      page: 1,
    });

    this.loadCustomers();
  }

  onPageChange(page: number) {
    this.request.set({ ...this.request(), page: page });
    this.loadCustomers();
  }
}
