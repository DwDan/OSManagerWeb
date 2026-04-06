import { CommonModule } from '@angular/common';
import { Component, inject, output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterContainerComponent } from '@components/shared/filter-container/filter-container.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { filterUserLiterals } from '@i18n/users/filter-user.literals';
import { GerUsersRequest } from '@models/users/requests/get-users.request';
import { PoFieldModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-filter-user',
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, FilterContainerComponent],
  templateUrl: './filter-user.component.html',
  styleUrl: './filter-user.component.scss',
})
export class FilterUserComponent {
  private readonly formBuilder = inject(FormBuilder);

  @ViewChild('filtersForm', { static: true }) filtersForm!: TemplateRef<unknown>;
  @ViewChild(FilterContainerComponent) filterContainer!: FilterContainerComponent;

  readonly literals = injectI18n(filterUserLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly filterChange = output<Partial<GerUsersRequest>>();

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
