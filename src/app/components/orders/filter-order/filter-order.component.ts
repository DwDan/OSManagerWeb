import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterContainerComponent } from '@components/shared/filter-container/filter-container.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { filterOrderLiterals } from '@i18n/orders/filter-order.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { GerOrdersRequest } from '@models/orders/requests/get-orders.request';
import { ExecutionResult } from '@models/orders/types/execution-result.enum';
import { OrderStatus } from '@models/orders/types/order-status.enum';
import { PoFieldModule, PoSelectOption } from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { ServicesService } from '@services/services/services.service';
import { UsersService } from '@services/users/users.service';

@Component({
  selector: 'app-filter-order',
  templateUrl: './filter-order.component.html',
  styleUrls: ['./filter-order.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, FilterContainerComponent],
})
export class FilterOrderComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly customersService = inject(CustomersService);
  private readonly usersService = inject(UsersService);
  private readonly servicesService = inject(ServicesService);

  @ViewChild('filtersForm', { static: true }) filtersForm!: TemplateRef<unknown>;
  @ViewChild(FilterContainerComponent) filterContainer!: FilterContainerComponent;

  readonly literals = injectI18n(filterOrderLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly filterChange = output<Partial<GerOrdersRequest>>();

  readonly customerOptions = signal<PoSelectOption[]>([]);
  readonly technicianOptions = signal<PoSelectOption[]>([]);
  readonly serviceOptions = signal<PoSelectOption[]>([]);
  readonly statusOptions = signal<PoSelectOption[]>([]);
  readonly executionResultOptions = signal<PoSelectOption[]>([]);

  readonly form = this.formBuilder.group({
    code: [''],
    customerId: [''],
    technicianId: [''],
    serviceId: [''],
    status: [''],
    executionResult: [''],
  });

  ngOnInit(): void {
    this.setStaticOptions();
    this.loadCustomers();
    this.loadTechnicians();
    this.loadServices();
    this.emitFilter();
  }

  openMobileFilters(): void {
    this.filterContainer.openMobileFilters();
  }

  clearFilters(): void {
    this.form.reset({
      code: '',
      customerId: '',
      technicianId: '',
      serviceId: '',
      status: '',
      executionResult: '',
    });
  }

  filter(): void {
    this.emitFilter();
  }

  private setStaticOptions(): void {
    this.statusOptions.set([
      { value: OrderStatus.Pending, label: this.literals().status.pending },
      { value: OrderStatus.Open, label: this.literals().status.open },
      { value: OrderStatus.InProgress, label: this.literals().status.inProgress },
      { value: OrderStatus.Closed, label: this.literals().status.closed },
      { value: OrderStatus.Canceled, label: this.literals().status.canceled },
    ]);

    this.executionResultOptions.set([
      { value: ExecutionResult.Successful, label: this.literals().executionResult.successful },
      { value: ExecutionResult.Unsuccessful, label: this.literals().executionResult.unsuccessful },
    ]);
  }

  private emitFilter(): void {
    const rawValue = this.form.getRawValue();

    this.filterChange.emit({
      code: rawValue.code || undefined,
      customerId: rawValue.customerId || undefined,
      technicianId: rawValue.technicianId || undefined,
      serviceId: rawValue.serviceId || undefined,
      status: (rawValue.status as OrderStatus | '') || undefined,
      executionResult: (rawValue.executionResult as ExecutionResult | '') || undefined,
      page: 1,
    });
  }

  private loadCustomers(): void {
    this.customersService.getAllCustomers().subscribe({
      next: (response) => {
        this.customerOptions.set(
          response.map((customer) => ({
            value: customer.id,
            label: customer.name,
          })),
        );
      },
    });
  }

  private loadTechnicians(): void {
    this.usersService.getAllUsers().subscribe({
      next: (response) => {
        this.technicianOptions.set(
          response.map((technician) => ({
            value: technician.id,
            label: technician.firstName,
          })),
        );
      },
    });
  }

  private loadServices(): void {
    this.servicesService.getAllServices().subscribe({
      next: (response) => {
        this.serviceOptions.set(
          response.map((service) => ({
            value: service.id,
            label: service.name,
          })),
        );
      },
    });
  }
}
