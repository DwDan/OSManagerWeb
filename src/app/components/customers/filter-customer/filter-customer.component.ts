import { CommonModule } from '@angular/common';
import { Component, inject, output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterContainerComponent } from '@components/shared/filter-container/filter-container.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { filterCustomerLiterals } from '@i18n/customers/filter-customer.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { GerCustomersRequest } from '@models/customers/requests/get-customers.request';
import { PoFieldModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-filter-customer',
  templateUrl: './filter-customer.component.html',
  styleUrl: './filter-customer.component.scss',
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, FilterContainerComponent],
})
export class FilterCustomerComponent {
  private readonly formBuilder = inject(FormBuilder);

  @ViewChild('filtersForm', { static: true }) filtersForm!: TemplateRef<unknown>;
  @ViewChild(FilterContainerComponent) filterContainer!: FilterContainerComponent;

  readonly literals = injectI18n(filterCustomerLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly filterChange = output<Partial<GerCustomersRequest>>();

  readonly form = this.formBuilder.group({
    name: [''],
  });

  clearFilters(): void {
    this.form.reset({
      name: '',
    });
  }

  filter(): void {
    this.emitFilter();
  }

  openMobileFilters(): void {
    this.filterContainer.openMobileFilters();
  }

  private emitFilter(): void {
    const rawValue = this.form.getRawValue();

    this.filterChange.emit({
      name: rawValue.name || undefined,
      page: 1,
    });
  }
}
