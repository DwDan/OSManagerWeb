import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customersLiterals } from '@i18n/customers/customers.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomerDetailsResponse } from '@models/customers/responses/customer-details.response';
import { PoModalModule } from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detail-customer',
  templateUrl: './detail-customer.component.html',
  styleUrls: ['./detail-customer.component.scss'],
  standalone: true,
  imports: [CommonModule, PoModalModule],
})
export class DetailCustomerComponent
  extends BaseModalComponent<{ customerId: string }, {}>
  implements OnInit
{
  private readonly customersService = inject(CustomersService);

  readonly literals = injectI18n(customersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);
  readonly customer = signal<CustomerDetailsResponse | null>(null);

  ngOnInit(): void {
    this.loadCustomer();
  }

  closeModal(): void {
    this.close();
  }

  private loadCustomer(): void {
    this.loading.set(true);

    this.customersService
      .getById(this.data!.customerId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (customer) => this.customer.set(customer),
      });
  }
}
