import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customizationLiterals } from '@i18n/customization/customization.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import { CustomFunctionResponse } from '@models/customization/responses/custom-function.response';
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
  readonly customFieldOptions = computed<PoSelectOption[]>(() => (this.data?.fields ?? []).map((x) => ({ label: x.name, value: x.key })));
  readonly statusOptions = computed<PoSelectOption[]>(() => (this.data?.statuses ?? []).map((x) => ({ label: x.name, value: x.key })));
  readonly roleOptions = computed<PoMultiselectOption[]>(() => (this.data?.roles ?? []).map((role) => ({ label: role.name, value: role.name })));
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    stepType: [CustomFunctionStepType.SetCustomField, [Validators.required]],
    targetFieldKey: [''],
    valueExpression: ['', [Validators.required]],
    allowedCustomRoleNames: [[] as string[]],
  });
  readonly formInvalid = formInvalidSignal(this.form);
  readonly primaryAction = computed<PoModalAction>(() => ({ label: this.common().save, action: () => this.save(), loading: this.loading(), disabled: this.formInvalid() }));
  readonly secondaryAction = computed<PoModalAction>(() => ({ label: this.common().cancel, action: () => this.close(), loading: this.loading() }));

  ngOnInit(): void {
    const item = this.data?.item;
    const step = item?.steps[0];
    if (item) {
      this.form.reset({
        name: item.name,
        stepType: step?.type === 'UpdateStatus' ? CustomFunctionStepType.UpdateStatus : CustomFunctionStepType.SetCustomField,
        targetFieldKey: step?.targetFieldKey ?? '',
        valueExpression: step?.valueExpression ?? '',
        allowedCustomRoleNames: item.allowedCustomRoleNames ?? [],
      });
    }
  }

  shouldSelectStatusValue(): boolean {
    return this.form.controls.stepType.value === CustomFunctionStepType.UpdateStatus;
  }

  save(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const request = {
      entityName: this.data!.entityName,
      customEntityId: this.data?.customEntityId ?? null,
      name: raw.name,
      inputs: [],
      steps: [{ type: raw.stepType, targetFieldKey: raw.stepType === CustomFunctionStepType.SetCustomField ? raw.targetFieldKey || null : null, valueExpression: raw.valueExpression, executionOrder: 1, conditionLogic: CustomFunctionConditionLogic.And, conditions: [] }],
      validations: [],
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
}
