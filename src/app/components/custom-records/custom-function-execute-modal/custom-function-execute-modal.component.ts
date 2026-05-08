import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customRecordsLiterals } from '@i18n/custom-records/custom-records.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import { CustomFunctionResponse } from '@models/customization/responses/custom-function.response';
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
  selector: 'app-custom-function-execute-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule],
  templateUrl: './custom-function-execute-modal.component.html',
})
export class CustomFunctionExecuteModalComponent
  extends BaseModalComponent<
    { recordId: string; function: CustomFunctionResponse; fields: CustomFieldResponse[] },
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
  readonly inputs = computed(() => [...(this.data?.function.inputs ?? [])].sort((a, b) => a.displayOrder - b.displayOrder));

  readonly form = this.formBuilder.nonNullable.group({});
  readonly formInvalid = formInvalidSignal(this.form);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().send,
    action: () => this.execute(),
    loading: this.loading(),
    disabled: this.formInvalid(),
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: () => this.close(),
    loading: this.loading(),
  }));

  ngOnInit(): void {
    for (const input of this.inputs()) {
      this.form.addControl(
        input.key,
        this.formBuilder.nonNullable.control('', input.isRequired ? [Validators.required] : []),
      );
    }

    this.loadReferenceOptions();
  }

  options(inputKey: string): PoSelectOption[] {
    return this.referenceOptions()[inputKey] ?? [];
  }

  execute(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }

    const inputs = Object.entries(this.form.getRawValue())
      .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
      .map(([key, value]) => ({ key, value: String(value) }));

    this.loading.set(true);
    this.service
      .executeCustomEntityRecordFunction(this.data!.recordId, this.data!.function.key, { inputs })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.functionExecuted);
          this.submit({ confirmed: true });
        },
      });
  }

  private loadReferenceOptions(): void {
    for (const input of this.inputs().filter((item) => this.isEntityReference(item.type))) {
      const field = this.getTargetField(input.key);

      this.getReferenceOptions(field).subscribe({
        next: (options) => {
          this.referenceOptions.update((current) => ({
            ...current,
            [input.key]: options,
          }));
        },
      });
    }
  }

  private getTargetField(inputKey: string): CustomFieldResponse | undefined {
    const inputExpression = `{{inputs.${inputKey}}}`;
    const step = this.data?.function.steps.find(
      (item) => item.type === 'SetCustomField' && item.valueExpression === inputExpression,
    );

    return this.data?.fields.find((field) => field.key === (step?.targetFieldKey ?? inputKey));
  }

  private getReferenceOptions(field?: CustomFieldResponse): Observable<PoSelectOption[]> {
    if (!field?.referenceEntityName) {
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
