import { CommonModule } from '@angular/common';
import { Component, OnChanges, SimpleChanges, TemplateRef, ViewChild, computed, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterContainerComponent } from '@components/shared/filter-container/filter-container.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import { CustomFieldType } from '@models/customization/types/custom-field-type.enum';
import { PoFieldModule, PoSelectOption } from '@po-ui/ng-components';

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

  @ViewChild('filtersForm', { static: true }) filtersForm!: TemplateRef<unknown>;
  @ViewChild(FilterContainerComponent) filterContainer!: FilterContainerComponent;

  readonly fields = input<CustomFieldResponse[]>([]);
  readonly title = input.required<string>();
  readonly filterChange = output<CustomFieldsFilterValue>();

  readonly common = injectI18n(commonLiterals);
  readonly fieldType = CustomFieldType;

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

  private rebuildCustomFieldControls(): void {
    const controls = this.form.controls.customFields;

    for (const key of Object.keys(controls.controls)) {
      controls.removeControl(key);
    }

    for (const field of this.filterableFields()) {
      controls.addControl(field.key, this.formBuilder.nonNullable.control(''));
    }
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
