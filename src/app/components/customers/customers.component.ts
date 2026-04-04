import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { commonLiterals } from '@i18n/common/common.literals';
import { customersLiterals } from '@i18n/customers/customers.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomerListItemResponse } from '@models/customers/responses/customer-list-item.response';
import { CustomerResponse } from '@models/customers/responses/customer.response';
import {
  PoPageAction,
  PoPageModule,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
} from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { ModalService } from '@services/modal/modal.service';
import { finalize } from 'rxjs';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';
import { UpdateCustomerComponent } from './update-customer/update-customer.component';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, PoTableModule, PoPageModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  private readonly customersService = inject(CustomersService);
  private readonly modalService = inject(ModalService);

  readonly literals = injectI18n(customersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly spacing = PoTableColumnSpacing;

  readonly loading = signal(false);
  readonly items = signal<CustomerListItemResponse[]>([]);

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
}
