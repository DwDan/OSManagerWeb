import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitySelectComponent } from '@components/shared/city-select/city-select.component';
import { StateSelectComponent } from '@components/shared/state-select/state-select.component';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customersLiterals } from '@i18n/customers/customers.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { UpdateCustomerRequest } from '@models/customers/requests/update-customer.request';
import { PoFieldModule, PoModalModule, PoNotificationService } from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoFieldModule,
    PoModalModule,
    StateSelectComponent,
    CitySelectComponent,
  ],
})
export class UpdateCustomerComponent
  extends BaseModalComponent<{ customerId: string }, { confirmed: boolean }>
  implements OnInit
{
  private readonly customersService = inject(CustomersService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(customersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    phone: [''],
    email: [''],
    postalCode: [''],
    street: ['', [Validators.required]],
    number: [''],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    country: ['Brasil', [Validators.required]],
    complement: [''],
    reference: [''],
  });

  ngOnInit(): void {
    this.loadCustomer();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.getRawValue() as UpdateCustomerRequest;

    this.saving.set(true);

    this.customersService
      .update(this.data!.customerId, request)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.updated);
          this.submit({ confirmed: true });
        },
      });
  }

  cancel(): void {
    this.close();
  }

  private loadCustomer(): void {
    this.loading.set(true);

    this.customersService
      .getById(this.data!.customerId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (customer) => {
          this.form.reset({
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
          });
        },
      });
  }
}
