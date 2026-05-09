import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customizationLiterals } from '@i18n/customization/customization.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CreateCustomFunctionInputRequest, CreateCustomFunctionStepRequest, CreateCustomFunctionValidationRequest } from '@models/customization/requests/custom-function.request';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import { CustomFunctionResponse, CustomFunctionValidationResponse } from '@models/customization/responses/custom-function.response';
import { CustomRoleResponse } from '@models/customization/responses/custom-role.response';
import { CustomStatusResponse } from '@models/customization/responses/custom-status.response';
import { CustomFunctionConditionLogic } from '@models/customization/types/custom-function-condition-logic.enum';
import { CustomFunctionStepType } from '@models/customization/types/custom-function-step-type.enum';
import { PoFieldModule, PoModalAction, PoModalModule, PoMultiselectOption, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { CustomizationService } from '@services/customization/customization.service';
import { finalize, Observable } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-custom-function-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoModalModule, PoFieldModule],
  templateUrl: './custom-function-modal.component.html',
})
export class CustomFunctionModalComponent
  extends BaseModalComponent<
    { entityName: string; customEntityId?: string | null; fields: CustomFieldResponse[]; statuses: CustomStatusResponse[]; roles: CustomRoleResponse[]; item?: CustomFunctionResponse },
    { confirmed: boolean }
  >
  implements OnInit
{
  private readonly service = inject(CustomizationService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);
  readonly literals = injectI18n(customizationLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly stepTypeOptions = computed<PoSelectOption[]>(() => [
    { label: this.literals().stepTypes.setCustomField, value: CustomFunctionStepType.SetCustomField },
    { label: this.literals().stepTypes.updateStatus, value: CustomFunctionStepType.UpdateStatus },
  ]);
  readonly customFieldOptions = computed<PoMultiselectOption[]>(() => (this.data?.fields ?? []).map((x) => ({ label: x.name, value: x.key })));
  readonly statusOptions = computed<PoSelectOption[]>(() => (this.data?.statuses ?? []).map((x) => ({ label: x.name, value: x.key })));
  readonly targetStatusOptions = computed<PoSelectOption[]>(() => [
    { label: this.common().notInformed, value: '' },
    ...this.statusOptions(),
  ]);
  readonly allowedStatusOptions = computed<PoSelectOption[]>(() => [
    { label: this.common().notInformed, value: '' },
    ...(this.data?.statuses ?? []).map((x) => ({ label: x.name, value: x.id })),
  ]);
  readonly roleOptions = computed<PoMultiselectOption[]>(() => (this.data?.roles ?? []).map((role) => ({ label: role.name, value: role.name })));
  readonly ruleTypeOptions = computed<PoSelectOption[]>(() => [
    { label: this.literals().rules.currentStatusIs, value: 'currentStatusIs' },
    { label: this.literals().rules.fieldIs, value: 'fieldIs' },
    { label: this.literals().rules.fieldIsFilled, value: 'fieldIsFilled' },
    { label: this.literals().rules.fieldIsEmpty, value: 'fieldIsEmpty' },
  ]);
  readonly validations = signal<CreateCustomFunctionValidationRequest[]>([]);
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    fieldKeys: [[] as string[]],
    targetStatusKey: [''],
    allowedCustomRoleNames: [[] as string[]],
    ruleType: ['currentStatusIs'],
    ruleFieldKey: [''],
    ruleStatusId: [''],
    ruleExpectedValue: [''],
    ruleErrorMessage: [''],
  });
  readonly formInvalid = formInvalidSignal(this.form);
  readonly primaryAction = computed<PoModalAction>(() => ({ label: this.common().save, action: () => this.save(), loading: this.loading(), disabled: this.formInvalid() }));
  readonly secondaryAction = computed<PoModalAction>(() => ({ label: this.common().cancel, action: () => this.close(), loading: this.loading() }));

  ngOnInit(): void {
    const item = this.data?.item;
    if (item) {
      this.form.reset({
        name: item.name,
        fieldKeys: item.steps
          .filter((step) => step.type === 'SetCustomField' && !!step.targetFieldKey)
          .map((step) => step.targetFieldKey!),
        targetStatusKey: item.steps.find((step) => step.type === 'UpdateStatus')?.valueExpression ?? '',
        allowedCustomRoleNames: item.allowedCustomRoleNames ?? [],
        ruleType: 'currentStatusIs',
        ruleFieldKey: '',
        ruleStatusId: '',
        ruleExpectedValue: '',
        ruleErrorMessage: '',
      });
      this.validations.set(this.toRequestValidations(item.validations));
    }
  }

  save(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const inputs = this.buildInputs(raw.fieldKeys);
    const steps = this.buildSteps(raw.fieldKeys, raw.targetStatusKey);
    const validations = this.buildValidations();
    const request = {
      entityName: this.data!.entityName,
      customEntityId: this.data?.customEntityId ?? null,
      name: raw.name,
      inputs,
      steps,
      validations,
      allowedCustomRoleNames: raw.allowedCustomRoleNames,
    };
    const operation: Observable<string | void> = this.data?.item
      ? this.service.updateFunction(this.data.item.id, { ...request, key: this.data.item.key, isActive: this.data.item.isActive })
      : this.service.createFunction(request);
    this.loading.set(true);
    operation.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.notification.success(this.data?.item ? this.literals().notifications.updated : this.literals().notifications.created);
        this.submit({ confirmed: true });
      },
    });
  }

  addValidation(): void {
    const raw = this.form.getRawValue();
    const validation = this.buildValidationFromRule(
      raw.ruleType,
      raw.ruleFieldKey,
      raw.ruleStatusId,
      raw.ruleExpectedValue,
      raw.ruleErrorMessage,
      this.validations().length + 1,
    );

    if (!validation) {
      return;
    }

    this.validations.update((items) => [...items, validation]);

    this.form.patchValue({
      ruleFieldKey: '',
      ruleStatusId: '',
      ruleExpectedValue: '',
      ruleErrorMessage: '',
    });
  }

  removeValidation(index: number): void {
    this.validations.update((items) =>
      items
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({ ...item, executionOrder: itemIndex + 1 })),
    );
  }

  private buildInputs(fieldKeys: string[]): CreateCustomFunctionInputRequest[] {
    return fieldKeys
      .map((fieldKey, index) => {
        const field = this.data?.fields.find((item) => item.key === fieldKey);

        if (!field) {
          return null;
        }

        return {
          key: field.key,
          label: field.name,
          type: field.type,
          isRequired: true,
          displayOrder: index + 1,
        };
      })
      .filter((input): input is CreateCustomFunctionInputRequest => input !== null);
  }

  private buildSteps(fieldKeys: string[], targetStatusKey: string): CreateCustomFunctionStepRequest[] {
    const steps: CreateCustomFunctionStepRequest[] = fieldKeys.map((fieldKey, index) => ({
      type: CustomFunctionStepType.SetCustomField,
      targetFieldKey: fieldKey,
      valueExpression: this.buildInputExpression(fieldKey),
      executionOrder: index + 1,
      conditionLogic: CustomFunctionConditionLogic.And,
      conditions: [],
    }));

    if (targetStatusKey) {
      steps.push({
        type: CustomFunctionStepType.UpdateStatus,
        targetFieldKey: null,
        valueExpression: targetStatusKey,
        executionOrder: steps.length + 1,
        conditionLogic: CustomFunctionConditionLogic.And,
        conditions: [],
      });
    }

    return steps;
  }

  private buildValidations(): CreateCustomFunctionValidationRequest[] {
    return this.validations().map((validation, index) => ({
      ...validation,
      executionOrder: index + 1,
    }));
  }

  private toValidationSource(source: string): number {
    return ({ Input: 1, CustomField: 2, Entity: 3, CurrentUser: 4 } as Record<string, number>)[source] ?? Number(source);
  }

  private toValidationOperator(operator: string): number {
    return ({ Required: 1, Equals: 2, NotEquals: 3, In: 4, NotIn: 5, GreaterThan: 6, LessThan: 7 } as Record<string, number>)[operator] ?? Number(operator);
  }

  private buildInputExpression(targetFieldKey: string): string {
    return targetFieldKey ? `{{inputs.${targetFieldKey}}}` : '';
  }

  private buildValidationFromRule(
    ruleType: string,
    fieldKey: string,
    statusId: string,
    expectedValue: string,
    errorMessage: string,
    executionOrder: number,
  ): CreateCustomFunctionValidationRequest | null {
    const message = errorMessage.trim();

    if (ruleType === 'currentStatusIs') {
      if (!statusId) {
        return null;
      }

      return {
        source: 3,
        operator: 2,
        fieldKey: 'customStatusId',
        expectedValue: statusId,
        errorMessage: message || 'Função não permitida para o status atual.',
        executionOrder,
      };
    }

    if (!fieldKey) {
      return null;
    }

    if (ruleType === 'fieldIsFilled') {
      return {
        source: 2,
        operator: 1,
        fieldKey,
        expectedValue: null,
        errorMessage: message || 'Campo obrigatório para executar a função.',
        executionOrder,
      };
    }

    if (ruleType === 'fieldIsEmpty') {
      return {
        source: 2,
        operator: 2,
        fieldKey,
        expectedValue: '',
        errorMessage: message || 'Campo precisa estar vazio para executar a função.',
        executionOrder,
      };
    }

    if (ruleType === 'fieldIs' && expectedValue.trim()) {
      return {
        source: 2,
        operator: 2,
        fieldKey,
        expectedValue: expectedValue.trim(),
        errorMessage: message || 'Condição do campo não atendida.',
        executionOrder,
      };
    }

    return null;
  }

  private toRequestValidations(validations: CustomFunctionValidationResponse[]): CreateCustomFunctionValidationRequest[] {
    return validations.map((validation) => ({
      source: this.toValidationSource(validation.source),
      operator: this.toValidationOperator(validation.operator),
      fieldKey: validation.fieldKey,
      expectedValue: validation.expectedValue,
      errorMessage: validation.errorMessage,
      executionOrder: validation.executionOrder,
    }));
  }

  validationDescription(validation: CreateCustomFunctionValidationRequest): string {
    if (validation.source === 3 && validation.operator === 2 && validation.fieldKey === 'customStatusId') {
      const statusName = this.data?.statuses.find((status) => status.id === validation.expectedValue)?.name ?? validation.expectedValue;
      return this.literals().rules.currentStatusIsDescription.replace('{status}', statusName ?? '-');
    }

    const fieldName = this.data?.fields.find((field) => field.key === validation.fieldKey)?.name ?? validation.fieldKey;

    if (validation.source === 2 && validation.operator === 1) {
      return this.literals().rules.fieldIsFilledDescription.replace('{field}', fieldName);
    }

    if (validation.source === 2 && validation.operator === 2 && validation.expectedValue === '') {
      return this.literals().rules.fieldIsEmptyDescription.replace('{field}', fieldName);
    }

    return this.literals().rules.fieldIsDescription
      .replace('{field}', fieldName)
      .replace('{value}', validation.expectedValue ?? '-');
  }
}
