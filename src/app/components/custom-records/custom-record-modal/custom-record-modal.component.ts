import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customRecordsLiterals } from '@i18n/custom-records/custom-records.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomEntityRecordResponse } from '@models/customization/responses/custom-entity-record.response';
import { CustomEntityResponse } from '@models/customization/responses/custom-entity.response';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import { CustomFieldType } from '@models/customization/types/custom-field-type.enum';
import { CustomerResponse } from '@models/customers/responses/customer.response';
import { ServiceResponse } from '@models/services/responses/service.response';
import { UserResponse } from '@models/users/responses/user.response';
import { PoFieldModule, PoModalAction, PoModalModule, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { CustomersService } from '@services/customers/customers.service';
import { CustomizationService } from '@services/customization/customization.service';
import { ServicesService } from '@services/services/services.service';
import { UsersService } from '@services/users/users.service';
import { finalize, Observable, of } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-custom-record-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule],
  templateUrl: './custom-record-modal.component.html',
})
export class CustomRecordModalComponent
  extends BaseModalComponent<
    { entity: CustomEntityResponse; fields: CustomFieldResponse[]; item?: CustomEntityRecordResponse },
    { confirmed: boolean }
  >
  implements OnInit
{
  private readonly service = inject(CustomizationService);
  private readonly usersService = inject(UsersService);
  private readonly customersService = inject(CustomersService);
  private readonly servicesService = inject(ServicesService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(customRecordsLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly referenceOptions = signal<Record<string, PoSelectOption[]>>({});
  readonly fieldType = CustomFieldType;

  readonly fields = computed(() =>
    (this.data?.fields ?? [])
      .filter((field) => field.isActive && field.isEditableInForm !== false)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  );

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    values: this.formBuilder.nonNullable.group({}),
  });

  readonly formInvalid = formInvalidSignal(this.form);
  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: () => this.save(),
    loading: this.loading(),
    disabled: this.formInvalid(),
  }));
  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: () => this.close(),
    loading: this.loading(),
  }));

  ngOnInit(): void {
    for (const field of this.fields()) {
      this.form.controls.values.addControl(
        field.key,
        this.formBuilder.nonNullable.control('', field.isRequired ? [Validators.required] : []),
      );
    }

    this.loadReferenceOptions();

    if (!this.data?.item) {
      return;
    }

    const values = Object.fromEntries(this.data.item.customFields.map((field) => [field.key, field.value ?? '']));
    this.form.reset({
      name: this.data.item.name,
      values,
    });
  }

  options(field: CustomFieldResponse): PoSelectOption[] {
    return field.options.map((option) => ({ label: option, value: option }));
  }

  referenceFieldOptions(fieldKey: string): PoSelectOption[] {
    return this.referenceOptions()[fieldKey] ?? [];
  }

  save(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const customFields = Object.entries(raw.values)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([fieldKey, value]) => ({ fieldKey, value: String(value) }));

    const request = {
      name: raw.name,
      customFields,
    };

    const operation: Observable<string | void> = this.data?.item
      ? this.service.updateCustomEntityRecord(this.data.item.id, request)
      : this.service.createCustomEntityRecord(this.data!.entity.id, request);

    this.loading.set(true);
    operation.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.notification.success(this.data?.item ? this.literals().notifications.updated : this.literals().notifications.created);
        this.submit({ confirmed: true });
      },
    });
  }

  private loadReferenceOptions(): void {
    for (const field of this.fields().filter((item) => this.isEntityReference(item.type))) {
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
        this.service.getCustomEntityRecords(field.referenceCustomEntityId!).subscribe({
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

  isBoolean(type: CustomFieldType | string): boolean {
    return type === CustomFieldType.Boolean || type === 'Boolean';
  }

  isDate(type: CustomFieldType | string): boolean {
    return type === CustomFieldType.Date || type === 'Date';
  }

  isEntityReference(type: CustomFieldType | string): boolean {
    return type === CustomFieldType.EntityReference || type === 'EntityReference';
  }
}
