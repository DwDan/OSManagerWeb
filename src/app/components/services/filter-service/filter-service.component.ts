import { CommonModule } from '@angular/common';
import { Component, inject, output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterContainerComponent } from '@components/shared/filter-container/filter-container.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { filterServiceLiterals } from '@i18n/services/filter-service.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { GerServicesRequest } from '@models/services/requests/get-services.request';
import { PoFieldModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-filter-service',
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, FilterContainerComponent],
  templateUrl: './filter-service.component.html',
  styleUrl: './filter-service.component.scss',
})
export class FilterServiceComponent {
  private readonly formBuilder = inject(FormBuilder);

  @ViewChild('filtersForm', { static: true }) filtersForm!: TemplateRef<unknown>;
  @ViewChild(FilterContainerComponent) filterContainer!: FilterContainerComponent;

  readonly literals = injectI18n(filterServiceLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly filterChange = output<Partial<GerServicesRequest>>();

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

  private emitFilter(): void {
    const rawValue = this.form.getRawValue();

    this.filterChange.emit({
      name: rawValue.name || undefined,
      page: 1,
    });
  }
}
