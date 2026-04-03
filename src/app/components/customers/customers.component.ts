import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { commonLiterals } from '@i18n/common/common.literals';
import { customersLiterals } from '@i18n/customers/customers.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CreateCustomerRequest } from '@models/customers/requests/create-customer.request';
import { UpdateCustomerRequest } from '@models/customers/requests/update-customer.request';
import { CustomerDetailsResponse } from '@models/customers/responses/customer-details.response';
import { CustomerListItemResponse } from '@models/customers/responses/customer-list-item.response';
import { CustomerResponse } from '@models/customers/responses/customer.response';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
} from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-customers',
  imports: [
    CommonModule,
    FormsModule,
    PoTableModule,
    PoPageModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  @ViewChild('createModal', { static: true }) createModal!: PoModalComponent;
  @ViewChild('editModal', { static: true }) editModal!: PoModalComponent;
  @ViewChild('detailsModal', { static: true }) detailsModal!: PoModalComponent;

  private readonly customersService = inject(CustomersService);
  private readonly poNotification = inject(PoNotificationService);

  readonly literals = injectI18n(customersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly spacing = PoTableColumnSpacing;

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly items = signal<CustomerListItemResponse[]>([]);
  readonly selectedCustomer = signal<CustomerDetailsResponse | null>(null);
  readonly selectedCustomerId = signal<string | null>(null);

  createForm: CreateCustomerRequest = this.createEmptyCustomerForm();

  editForm: UpdateCustomerRequest = this.createEmptyCustomerForm();

  readonly pageActions = computed<PoPageAction[]>(() => [
    {
      label: this.literals().pageActions.newCustomer,
      action: () => this.openCreateModal(),
    },
    {
      label: this.literals().pageActions.refresh,
      action: () => this.loadCustomers(),
    },
  ]);

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

  openCreateModal(): void {
    this.createForm = this.createEmptyCustomerForm();
    this.createModal.open();
  }

  saveCreate(): void {
    this.saving.set(true);

    this.customersService
      .create(this.createForm)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.created);
          this.createModal.close();
          this.loadCustomers();
        },
      });
  }

  openEditModal(id: string): void {
    this.saving.set(true);

    this.customersService
      .getById(id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (customer) => {
          this.selectedCustomerId.set(id);
          this.editForm = {
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            postalCode: customer.address.postalCode,
            street: customer.address.street,
            number: customer.address.number,
            city: customer.address.city,
            state: customer.address.state,
            country: customer.address.country,
            complement: customer.address.complement ?? '',
            reference: customer.address.reference ?? '',
          };
          this.editModal.open();
        },
      });
  }

  saveEdit(): void {
    const id = this.selectedCustomerId();

    if (!id) {
      return;
    }

    this.saving.set(true);

    this.customersService
      .update(id, this.editForm)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.updated);
          this.editModal.close();
          this.loadCustomers();
        },
      });
  }

  openDetails(id: string): void {
    this.saving.set(true);

    this.customersService
      .getById(id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (customer) => {
          this.selectedCustomer.set(customer);
          this.detailsModal.open();
        },
      });
  }

  private loadCustomers(): void {
    this.loading.set(true);

    this.customersService
      .getCustomers()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (customers) => {
          this.items.set(customers.map((customer) => this.mapCustomerToListItem(customer)));
        },
      });
  }

  private mapCustomerToListItem(customer: CustomerResponse): CustomerListItemResponse {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.address.city,
      state: customer.address.state,
    };
  }

  private createEmptyCustomerForm(): CreateCustomerRequest {
    return {
      name: '',
      phone: '',
      email: '',
      postalCode: '',
      street: '',
      number: '',
      city: '',
      state: '',
      country: 'Brasil',
      complement: '',
      reference: '',
    };
  }
}
