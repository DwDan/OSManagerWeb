import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitySelectComponent } from '@components/shared/city-select/city-select.component';
import { PostalCodeComponent } from '@components/shared/postal-code/postal-code.component';
import { StateSelectComponent } from '@components/shared/state-select/state-select.component';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { ordersLiterals } from '@i18n/orders/orders.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomerResponse } from '@models/customers/responses/customer.response';
import { PostalCodeAddress } from '@models/locations/response/postal-code-address.response';
import { CreateOrderRequest } from '@models/orders/requests/create-order.request';
import { UpdateOrderRequest } from '@models/orders/requests/update-order.request';
import { ServiceResponse } from '@models/services/responses/service.response';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
  PoModalModule,
  PoMultiselectOption,
  PoNotificationService,
  PoSelectOption,
} from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { OrdersService } from '@services/orders/orders.service';
import { ServicesService } from '@services/services/services.service';
import { finalize } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule,
    StateSelectComponent,
    CitySelectComponent,
    PostalCodeComponent,
  ],
})
export class UpdateOrderComponent extends BaseModalComponent<
  { orderId: string },
  { confirmed: boolean }
> {
  private readonly ordersService = inject(OrdersService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly customersService = inject(CustomersService);
  private readonly servicesService = inject(ServicesService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(ordersLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly customers = signal<PoSelectOption[]>([]);
  readonly services = signal<PoMultiselectOption[]>([]);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: this.save.bind(this),
    disabled: this.loading() || this.formInvalid(),
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: this.close.bind(this),
  }));

  readonly form = this.formBuilder.nonNullable.group({
    customerId: ['', [Validators.required]],
    services: [[] as string[]],
    postalCode: [''],
    street: ['', [Validators.required]],
    number: [''],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    country: ['Brasil', [Validators.required]],
    complement: [''],
    reference: [''],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  ngOnInit(): void {
    this.loadOrder();
    this.loadCustomers();
    this.loadServices();
  }

  loadOrder(): void {
    this.loading.set(true);

    this.ordersService
      .getById(this.data!.orderId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (order) => {
          this.form.reset({
            customerId: order.customer.id,
            services: order.services?.map((service) => service.id) ?? [],
            postalCode: order.address.postalCode,
            street: order.address.street,
            number: order.address.number,
            city: order.address.city,
            state: order.address.state,
            country: order.address.country,
            complement: order.address.complement ?? '',
            reference: order.address.reference ?? '',
          });
        },
      });
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.formInvalid()) {
      return;
    }

    const request: UpdateOrderRequest = {
      customerId: this.form.controls.customerId.getRawValue(),
      services: this.form.controls.services.getRawValue(),
      postalCode: this.form.controls.postalCode.getRawValue(),
      street: this.form.controls.street.getRawValue(),
      number: this.form.controls.number.getRawValue(),
      city: this.form.controls.city.getRawValue(),
      state: this.form.controls.state.getRawValue(),
      country: this.form.controls.country.getRawValue(),
      complement: this.form.controls.complement.getRawValue(),
      reference: this.form.controls.reference.getRawValue(),
    };

    this.loading.set(true);

    this.ordersService
      .update(this.data!.orderId, request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.updated);
          this.submit({ confirmed: true });
        },
      });
  }

  onAddressFound(address: PostalCodeAddress): void {
    this.form.patchValue({
      postalCode: address.postalCode,
      street: address.street,
      state: address.state,
      city: address.city,
      country: address.country,
      complement: this.form.controls.complement.value || address.complement,
    });
  }

  onAddressNotFound(): void {
    this.poNotification.warning(this.literals().validations.invalidPostalCode);
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
