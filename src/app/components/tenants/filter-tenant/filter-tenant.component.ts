import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterContainerComponent } from '@components/shared/filter-container/filter-container.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { filterTenantLiterals } from '@i18n/tenants/filter-tenant.literals';
import { GetPagedTenantsRequest } from '@models/tenants/requests/get-paged-tenants.request';
import { TenantStatus } from '@models/tenants/types/tenant-status.enum';
import { PoFieldModule, PoSelectOption } from '@po-ui/ng-components';

@Component({
  selector: 'app-filter-tenant',
  templateUrl: './filter-tenant.component.html',
  styleUrls: ['./filter-tenant.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, FilterContainerComponent],
})
export class FilterTenantComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  @ViewChild('filtersForm', { static: true }) filtersForm!: TemplateRef<unknown>;
  @ViewChild(FilterContainerComponent) filterContainer!: FilterContainerComponent;

  readonly literals = injectI18n(filterTenantLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly filterChange = output<Partial<GetPagedTenantsRequest>>();

  readonly statusOptions = signal<PoSelectOption[]>([]);

  readonly form = this.formBuilder.group({
    name: [''],
    slug: [''],
    status: [''],
    currentPlanId: [''],
  });

  ngOnInit(): void {
    this.setStaticOptions();
    this.emitFilter();
  }

  openMobileFilters(): void {
    this.filterContainer.openMobileFilters();
  }

  clearFilters(): void {
    this.form.reset({
      name: '',
      slug: '',
      status: '',
      currentPlanId: '',
    });
  }

  filter(): void {
    this.emitFilter();
  }

  private setStaticOptions(): void {
    this.statusOptions.set([
      { value: TenantStatus.Pending, label: this.literals().status.pending },
      { value: TenantStatus.Trial, label: this.literals().status.trial },
      { value: TenantStatus.Active, label: this.literals().status.active },
      { value: TenantStatus.Suspended, label: this.literals().status.suspended },
      { value: TenantStatus.Expired, label: this.literals().status.expired },
      { value: TenantStatus.Canceled, label: this.literals().status.canceled },
    ]);
  }

  private emitFilter(): void {
    const rawValue = this.form.getRawValue();

    this.filterChange.emit({
      name: rawValue.name || undefined,
      slug: rawValue.slug || undefined,
      status: (rawValue.status as TenantStatus | '') || undefined,
      currentPlanId: rawValue.currentPlanId || undefined,
      page: 1,
    });
  }
}
