import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { customizationLiterals } from '@i18n/customization/customization.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import { CustomizableEntityResponse } from '@models/customization/responses/customizable-entity.response';
import { CustomFieldType } from '@models/customization/types/custom-field-type.enum';
import { PoButtonModule, PoFieldModule, PoModalAction, PoModalModule, PoNotificationService, PoSelectOption, PoSwitchModule, PoTagModule } from '@po-ui/ng-components';
import { CustomizationService } from '@services/customization/customization.service';
import { finalize, Observable } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-custom-field-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule, PoSwitchModule, PoButtonModule, PoTagModule],
  templateUrl: './custom-field-modal.component.html',
})
export class CustomFieldModalComponent
  extends BaseModalComponent<
    { entityName: string; customEntityId?: string | null; item?: CustomFieldResponse; referenceTargets: CustomizableEntityResponse[] },
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
  readonly options = signal<string[]>([]);

  readonly fieldTypeOptions = computed<PoSelectOption[]>(() => [
    { label: this.literals().fieldTypes.text, value: CustomFieldType.Text },
    { label: this.literals().fieldTypes.number, value: CustomFieldType.Number },
    { label: this.literals().fieldTypes.decimal, value: CustomFieldType.Decimal },
    { label: this.literals().fieldTypes.date, value: CustomFieldType.Date },
    { label: this.literals().fieldTypes.boolean, value: CustomFieldType.Boolean },
    { label: this.literals().fieldTypes.select, value: CustomFieldType.Select },
    { label: this.literals().fieldTypes.entityReference, value: CustomFieldType.EntityReference },
  ]);

  readonly referenceTargetOptions = computed<PoSelectOption[]>(() =>
    (this.data?.referenceTargets ?? []).map((target) => ({ label: target.displayName, value: target.name })),
  );

  readonly form = this.formBuilder.nonNullable.group({
    key: [''],
    name: ['', [Validators.required]],
    type: [CustomFieldType.Text, [Validators.required]],
    isRequired: [false],
    mask: [''],
    options: [''],
    newOption: [''],
    displayOrder: [1, [Validators.required]],
    isFilterable: [false],
    isVisibleInList: [true],
    isEditableInForm: [true],
    referenceEntityName: [''],
  });

  readonly formInvalid = formInvalidSignal(this.form);
  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: () => this.save(),
    loading: this.loading(),
    disabled: this.formInvalid() || this.optionsInvalid(),
  }));
  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: () => this.close(),
    loading: this.loading(),
  }));

  ngOnInit(): void {
    const item = this.data?.item;
    if (item) {
      this.form.reset({
        key: item.key,
        name: item.name,
        type: item.type,
        isRequired: item.isRequired,
        mask: item.mask ?? '',
        options: '',
        newOption: '',
        displayOrder: item.displayOrder,
        isFilterable: item.isFilterable,
        isVisibleInList: item.isVisibleInList,
        isEditableInForm: item.isEditableInForm !== false,
        referenceEntityName: this.toReferenceTargetValue(item.referenceEntityName, item.referenceCustomEntityId),
      });
      this.options.set(item.options);
    }
  }

  isSelectType(): boolean {
    return this.form.controls.type.value === CustomFieldType.Select;
  }

  optionsInvalid(): boolean {
    return this.isSelectType() && this.options().length === 0;
  }

  addOption(): void {
    const value = this.form.controls.newOption.value.trim();

    if (!value || this.options().some((option) => option.toLowerCase() === value.toLowerCase())) {
      this.form.controls.newOption.reset('');
      return;
    }

    this.options.update((options) => [...options, value]);
    this.form.controls.newOption.reset('');
  }

  removeOption(option: string): void {
    this.options.update((options) => options.filter((item) => item !== option));
  }

  save(): void {
    if (this.formInvalid()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const referenceTarget = this.parseReferenceTarget(raw.referenceEntityName);
    const request = {
      entityName: this.data!.entityName,
      customEntityId: this.data?.customEntityId ?? null,
      name: raw.name,
      type: raw.type,
      isRequired: raw.isRequired,
      mask: raw.mask || null,
      options: this.isSelectType() ? this.options() : [],
      displayOrder: raw.displayOrder,
      isFilterable: raw.isFilterable,
      isVisibleInList: raw.isVisibleInList,
      isEditableInForm: raw.isEditableInForm,
      referenceEntityName: referenceTarget.entityName,
      referenceCustomEntityId: referenceTarget.customEntityId,
    };
    const operation: Observable<string | void> = this.data?.item
      ? this.service.updateField(this.data.item.id, request)
      : this.service.createField(request);

    this.loading.set(true);
    operation.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.notification.success(
          this.data?.item ? this.literals().notifications.updated : this.literals().notifications.created,
        );
        this.submit({ confirmed: true });
      },
    });
  }

  private parseReferenceTarget(value: string): { entityName: string | null; customEntityId: string | null } {
    if (!value) {
      return { entityName: null, customEntityId: null };
    }

    if (value.startsWith('custom:')) {
      return {
        entityName: 'CustomEntityRecord',
        customEntityId: value.replace('custom:', ''),
      };
    }

    return { entityName: value, customEntityId: null };
  }

  private toReferenceTargetValue(entityName?: string | null, customEntityId?: string | null): string {
    if (entityName === 'CustomEntityRecord' && customEntityId) {
      return `custom:${customEntityId}`;
    }

    return entityName ?? '';
  }
}
