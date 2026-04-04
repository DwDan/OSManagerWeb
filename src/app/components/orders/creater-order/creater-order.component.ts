import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { ordersLiterals } from '@i18n/orders/orders.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomerResponse } from '@models/customers/responses/customer.response';
import { CreateOrderRequest } from '@models/orders/requests/create-order.request';
import { ServiceResponse } from '@models/services/responses/service.response';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalModule,
  PoMultiselectOption,
  PoNotificationService,
  PoSelectOption,
} from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { OrdersService } from '@services/orders/orders.service';
import { ServicesService } from '@services/services/services.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-creater-order',
  templateUrl: './creater-order.component.html',
  styleUrl: './creater-order.component.scss',
  imports: [CommonModule, FormsModule, PoModalModule, PoFieldModule, PoButtonModule],
})
export class CreaterOrderComponent extends BaseModalComponent<{}, { confirmed: boolean }> {
  private readonly ordersService = inject(OrdersService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly customersService = inject(CustomersService);
  private readonly servicesService = inject(ServicesService);

  readonly literals = injectI18n(ordersLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly customers = signal<PoSelectOption[]>([]);
  readonly services = signal<PoMultiselectOption[]>([]);

  createForm: CreateOrderRequest = this.createEmptyOrderForm();

  readonly closeAction = {
    label: this.common().cancel,
    action: () => this.close(),
  };

  ngOnInit(): void {
    this.loadCustomers();
    this.loadServices();
  }

  saveCreate(): void {
    this.loading.set(true);

    this.ordersService
      .create(this.createForm)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.created);
          this.submit({ confirmed: true });
        },
      });
  }

  private loadCustomers(): void {
    this.customersService.getCustomers().subscribe({
      next: (customers: CustomerResponse[]) => {
        this.customers.set(
          customers.map((customer) => ({
            label: customer.name,
            value: customer.id,
          })),
        );
      },
    });
  }

  private loadServices(): void {
    this.servicesService.getServices().subscribe({
      next: (services: ServiceResponse[]) => {
        this.services.set(
          services.map((service) => ({
            label: service.name,
            value: service.id,
          })),
        );
      },
    });
  }

  private createEmptyOrderForm(): CreateOrderRequest {
    return {
      customerId: '',
      services: [],
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
