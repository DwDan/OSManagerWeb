import { CommonModule } from '@angular/common';
import { Component, OnChanges, SimpleChanges, TemplateRef, ViewChild, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterContainerComponent } from '@components/shared/filter-container/filter-container.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import { CustomFieldType } from '@models/customization/types/custom-field-type.enum';
import { CustomerResponse } from '@models/customers/responses/customer.response';
import { ServiceResponse } from '@models/services/responses/service.response';
import { UserResponse } from '@models/users/responses/user.response';
import { PoFieldModule, PoSelectOption } from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { CustomizationService } from '@services/customization/customization.service';
import { ServicesService } from '@services/services/services.service';
import { UsersService } from '@services/users/users.service';
import { Observable, of } from 'rxjs';

export interface CustomFieldsFilterValue {
  name?: string;
  customFields: Record<string, string>;
}

@Component({
  selector: 'app-custom-fields-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, FilterContainerComponent],
  templateUrl: './custom-fields-filter.component.html',
})
export class CustomFieldsFilterComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);
  private readonly customizationService = inject(CustomizationService);
  private readonly usersService = inject(UsersService);
  private readonly customersService = inject(CustomersService);
  private readonly servicesService = inject(ServicesService);

  @ViewChild('filtersForm', { static: true }) filtersForm!: TemplateRef<unknown>;
  @ViewChild(FilterContainerComponent) filterContainer!: FilterContainerComponent;

  readonly fields = input<CustomFieldResponse[]>([]);
  readonly title = input.required<string>();
  readonly filterChange = output<CustomFieldsFilterValue>();

  readonly common = injectI18n(commonLiterals);
  readonly fieldType = CustomFieldType;
  readonly referenceOptions = signal<Record<string, PoSelectOption[]>>({});

  readonly filterableFields = computed(() =>
    this.fields()
      .filter((field) => field.isActive && field.isFilterable)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  );

  readonly form = this.formBuilder.nonNullable.group({
    name: [''],
    customFields: this.formBuilder.nonNullable.group({}),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields']) {
      this.rebuildCustomFieldControls();
    }
  }

  openMobileFilters(): void {
    this.filterContainer.openMobileFilters();
  }

  clearFilters(): void {
    this.form.reset({
      name: '',
      customFields: {},
    });

    this.emitFilter();
  }

  filter(): void {
    this.emitFilter();
  }

  options(field: CustomFieldResponse): PoSelectOption[] {
    return field.options.map((option) => ({ label: option, value: option }));
  }

  referenceFieldOptions(fieldKey: string): PoSelectOption[] {
    return this.referenceOptions()[fieldKey] ?? [];
  }

  isBoolean(type: CustomFieldType | string): boolean {
    return type === CustomFieldType.Boolean || type === 'Boolean';
  }

  isDate(type: CustomFieldType | string): boolean {
    return type === CustomFieldType.Date || type === 'Date';
  }

  isSelect(type: CustomFieldType | string): boolean {
    return type === CustomFieldType.Select || type === 'Select';
  }

  isEntityReference(type: CustomFieldType | string): boolean {
    return type === CustomFieldType.EntityReference || type === 'EntityReference';
  }

  private rebuildCustomFieldControls(): void {
    const controls = this.form.controls.customFields;

    for (const key of Object.keys(controls.controls)) {
      controls.removeControl(key);
    }

    for (const field of this.filterableFields()) {
      controls.addControl(field.key, this.formBuilder.nonNullable.control(''));
    }

    this.loadReferenceOptions();
  }

  private loadReferenceOptions(): void {
    this.referenceOptions.set({});

    for (const field of this.filterableFields().filter((item) => this.isEntityReference(item.type))) {
      this.getReferenceOptions(field).subscribe({
        next: (options) => {
          this.referenceOptions.update((current) => ({
            ...current,
            [field.key]: options,
          }));
        },
      });
    }
  }

  private getReferenceOptions(field: CustomFieldResponse): Observable<PoSelectOption[]> {
    if (!field.referenceEntityName) {
      return of([]);
    }

    if (field.referenceEntityName === 'User') {
      return new Observable<PoSelectOption[]>((subscriber) => {
        this.usersService.getAllUsers().subscribe({
          next: (users: UserResponse[]) => {
            subscriber.next(users.map((user) => ({ label: `${user.firstName} ${user.lastName}`, value: user.id })));
            subscriber.complete();
          },
          error: (error) => subscriber.error(error),
        });
      });
    }

    if (field.referenceEntityName === 'Customer') {
      return new Observable<PoSelectOption[]>((subscriber) => {
        this.customersService.getAllCustomers().subscribe({
          next: (customers: CustomerResponse[]) => {
            subscriber.next(customers.map((customer) => ({ label: customer.name, value: customer.id })));
            subscriber.complete();
          },
          error: (error) => subscriber.error(error),
        });
      });
    }

    if (field.referenceEntityName === 'Service') {
      return new Observable<PoSelectOption[]>((subscriber) => {
        this.servicesService.getAllServices().subscribe({
          next: (services: ServiceResponse[]) => {
            subscriber.next(services.map((service) => ({ label: service.name, value: service.id })));
            subscriber.complete();
          },
          error: (error) => subscriber.error(error),
        });
      });
    }

    if (field.referenceEntityName === 'CustomEntityRecord' && field.referenceCustomEntityId) {
      return new Observable<PoSelectOption[]>((subscriber) => {
        this.customizationService.getCustomEntityRecords(field.referenceCustomEntityId!).subscribe({
          next: (records) => {
            subscriber.next(records.map((record) => ({ label: record.name, value: record.id })));
            subscriber.complete();
          },
          error: (error) => subscriber.error(error),
        });
      });
    }

    return of([]);
  }

  private emitFilter(): void {
    const rawValue = this.form.getRawValue();
    const customFields = Object.fromEntries(
      Object.entries(rawValue.customFields)
        .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
        .map(([key, value]) => [key, String(value)]),
    );

    this.filterChange.emit({
      name: rawValue.name || undefined,
      customFields,
    });
  }
}
