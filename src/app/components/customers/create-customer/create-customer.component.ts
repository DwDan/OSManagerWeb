import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitySelectComponent } from '@components/shared/city-select/city-select.component';
import { PostalCodeComponent } from '@components/shared/postal-code/postal-code.component';
import { StateSelectComponent } from '@components/shared/state-select/state-select.component';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customersLiterals } from '@i18n/customers/customers.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CreateCustomerRequest } from '@models/customers/requests/create-customer.request';
import { PostalCodeAddress } from '@models/locations/response/postal-code-address.response';
import { PoFieldModule, PoModalModule, PoNotificationService } from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoFieldModule,
    PoModalModule,
    StateSelectComponent,
    CitySelectComponent,
    PostalCodeComponent,
  ],
})
export class CreateCustomerComponent extends BaseModalComponent<{}, { confirmed: boolean }> {
  private readonly customersService = inject(CustomersService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(customersLiterals);
  readonly common = injectI18n(commonLiterals);

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

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.getRawValue() as CreateCustomerRequest;

    this.saving.set(true);

    this.customersService
      .create(request)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.created);
          this.submit({ confirmed: true });
        },
      });
  }

  cancel(): void {
    this.close();
  }
}
