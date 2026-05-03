import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { commonLiterals } from '@i18n/common/common.literals';
import { customizationLiterals } from '@i18n/customization/customization.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CustomEntityRecordRequest } from '@models/customization/requests/custom-entity-record.request';
import { CustomEntityRequest } from '@models/customization/requests/custom-entity.request';
import { CreateCustomFieldRequest } from '@models/customization/requests/custom-field.request';
import { CreateCustomFunctionRequest } from '@models/customization/requests/custom-function.request';
import { CreateCustomStatusRequest } from '@models/customization/requests/custom-status.request';
import { CustomEntityRecordResponse } from '@models/customization/responses/custom-entity-record.response';
import { CustomEntityResponse } from '@models/customization/responses/custom-entity.response';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import { CustomFunctionResponse } from '@models/customization/responses/custom-function.response';
import { CustomStatusResponse } from '@models/customization/responses/custom-status.response';
import { CustomizableEntityResponse } from '@models/customization/responses/customizable-entity.response';
import { CustomFieldType } from '@models/customization/types/custom-field-type.enum';
import { CustomFunctionConditionLogic } from '@models/customization/types/custom-function-condition-logic.enum';
import { CustomFunctionStepType } from '@models/customization/types/custom-function-step-type.enum';
import {
  PoButtonModule,
  PoFieldModule,
  PoInfoModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoSelectOption,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
  PoTagModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { CustomizationService } from '@services/customization/customization.service';
import { ModalService } from '@services/modal/modal.service';
import { finalize, forkJoin, Observable, of } from 'rxjs';
import { CustomEntityModalComponent } from './modals/custom-entity-modal/custom-entity-modal.component';
import { CustomFieldModalComponent } from './modals/custom-field-modal/custom-field-modal.component';
import { CustomFunctionModalComponent } from './modals/custom-function-modal/custom-function-modal.component';
import { CustomRecordModalComponent } from './modals/custom-record-modal/custom-record-modal.component';
import { CustomStatusModalComponent } from './modals/custom-status-modal/custom-status-modal.component';

type EntityFeature = 'fields' | 'statuses' | 'functions';
type CustomizationScope = { entityName: string; customEntityId: string | null };
type CustomizationSection =
  | 'entity'
  | 'definitions'
  | 'fields'
  | 'statuses'
  | 'functions'
  | 'records'
  | 'preview';

@Component({
  selector: 'app-customization',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PoPageModule,
    PoFieldModule,
    PoButtonModule,
    PoTableModule,
    PoWidgetModule,
    PoTagModule,
    PoInfoModule,
  ],
  templateUrl: './customization.component.html',
  styleUrl: './customization.component.scss',
})
export class CustomizationComponent implements OnInit {
  private readonly customizationService = inject(CustomizationService);
  private readonly modalService = inject(ModalService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(customizationLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly spacing = PoTableColumnSpacing;

  readonly loading = signal(false);
  readonly activeSection = signal<CustomizationSection>('entity');
  readonly showDefinitionForm = signal(false);
  readonly showRecordForm = signal(false);
  readonly showFieldForm = signal(false);
  readonly showStatusForm = signal(false);
  readonly showFunctionForm = signal(false);
  readonly selectedEntityName = signal<string>('CustomEntityRecord');
  readonly selectedFieldScope = signal<string>('entity:Order');
  readonly selectedStatusScope = signal<string>('entity:Order');
  readonly selectedFunctionScope = signal<string>('entity:Order');
  readonly selectedCustomEntityId = signal<string | null>(null);

  readonly catalog = signal<CustomizableEntityResponse[]>([]);
  readonly customEntities = signal<CustomEntityResponse[]>([]);
  readonly customEntityRecords = signal<CustomEntityRecordResponse[]>([]);
  readonly fields = signal<CustomFieldResponse[]>([]);
  readonly statuses = signal<CustomStatusResponse[]>([]);
  readonly functions = signal<CustomFunctionResponse[]>([]);

  readonly selectedEntity = computed(() =>
    this.catalog().find((item) => item.name === this.selectedEntityName()),
  );

  readonly selectedCustomEntity = computed(() =>
    this.customEntities().find((item) => item.id === this.selectedCustomEntityId()) ?? null,
  );

  readonly entityOptions = computed<PoSelectOption[]>(() =>
    this.catalog().map((entity) => ({
      label: entity.displayName,
      value: entity.name,
    })),
  );

  readonly customEntityOptions = computed<PoSelectOption[]>(() =>
    this.customEntities().map((entity) => ({
      label: entity.name,
      value: entity.id,
    })),
  );

  readonly referenceTargetOptions = computed<CustomizableEntityResponse[]>(() => [
    ...this.catalog().filter((entity) => entity.name !== 'CustomEntityRecord'),
    ...this.customEntities().map((entity) => ({
      name: `custom:${entity.id}`,
      displayName: entity.name,
      supportsCustomFields: false,
      supportsCustomStatuses: false,
      supportsCustomFunctions: false,
      properties: [],
      referenceTargets: [],
    })),
  ]);

  readonly fieldScopeOptions = computed<PoSelectOption[]>(() => [
    ...this.catalog()
      .filter((entity) => entity.supportsCustomFields && entity.name !== 'CustomEntityRecord')
      .map((entity) => ({
        label: entity.displayName,
        value: `entity:${entity.name}`,
      })),
    ...this.customEntities().map((entity) => ({
      label: entity.name,
      value: `custom:${entity.id}`,
    })),
  ]);

  readonly statusScopeOptions = computed<PoSelectOption[]>(() => [
    ...this.catalog()
      .filter((entity) => entity.supportsCustomStatuses && entity.name !== 'CustomEntityRecord')
      .map((entity) => ({
        label: entity.displayName,
        value: `entity:${entity.name}`,
      })),
    ...this.customEntities().map((entity) => ({
      label: entity.name,
      value: `custom:${entity.id}`,
    })),
  ]);

  readonly functionScopeOptions = computed<PoSelectOption[]>(() => [
    ...this.catalog()
      .filter((entity) => entity.supportsCustomFunctions && entity.name !== 'CustomEntityRecord')
      .map((entity) => ({
        label: entity.displayName,
        value: `entity:${entity.name}`,
      })),
    ...this.customEntities().map((entity) => ({
      label: entity.name,
      value: `custom:${entity.id}`,
    })),
  ]);

  readonly fieldTypeOptions = computed<PoSelectOption[]>(() => [
    { label: this.literals().fieldTypes.text, value: CustomFieldType.Text },
    { label: this.literals().fieldTypes.number, value: CustomFieldType.Number },
    { label: this.literals().fieldTypes.decimal, value: CustomFieldType.Decimal },
    { label: this.literals().fieldTypes.date, value: CustomFieldType.Date },
    { label: this.literals().fieldTypes.boolean, value: CustomFieldType.Boolean },
    { label: this.literals().fieldTypes.select, value: CustomFieldType.Select },
    { label: this.literals().fieldTypes.entityReference, value: CustomFieldType.EntityReference },
  ]);

  readonly customFieldOptions = computed<PoSelectOption[]>(() =>
    this.fields().map((field) => ({
      label: field.name,
      value: field.key,
    })),
  );

  readonly statusOptions = computed<PoSelectOption[]>(() =>
    this.statuses().map((status) => ({
      label: status.name,
      value: status.key,
    })),
  );

  readonly stepTypeOptions = computed<PoSelectOption[]>(() => [
    { label: this.literals().stepTypes.setCustomField, value: CustomFunctionStepType.SetCustomField },
    { label: this.literals().stepTypes.updateStatus, value: CustomFunctionStepType.UpdateStatus },
  ]);

  readonly pageActions = computed<PoPageAction[]>(() => {
    const actions: PoPageAction[] = [
      {
        label: this.literals().pageActions.refresh,
        icon: 'an an-arrows-clockwise',
        action: () => this.loadAll(),
        disabled: this.loading(),
      },
    ];

    const createAction = this.getCreateAction();

    if (createAction) {
      actions.unshift(createAction);
    }

    return actions;
  });

  readonly navigationItems = computed(() => [
    {
      key: 'entity' as const,
      label: this.literals().navigation.entity,
      icon: 'an an-database',
      count: this.selectedEntity() ? 1 : 0,
    },
    {
      key: 'definitions' as const,
      label: this.literals().navigation.definitions,
      icon: 'an an-folders',
      count: this.customEntities().length,
    },
    {
      key: 'fields' as const,
      label: this.literals().navigation.fields,
      icon: 'an an-textbox',
      count: this.fields().length,
    },
    {
      key: 'statuses' as const,
      label: this.literals().navigation.statuses,
      icon: 'an an-check-circle',
      count: this.statuses().length,
    },
    {
      key: 'functions' as const,
      label: this.literals().navigation.functions,
      icon: 'an an-flow-arrow',
      count: this.functions().length,
    },
    {
      key: 'records' as const,
      label: this.literals().navigation.records,
      icon: 'an an-list-bullets',
      count: this.customEntityRecords().length,
    },
    {
      key: 'preview' as const,
      label: this.literals().navigation.preview,
      icon: 'an an-eye',
      count: this.previewScore(),
    },
  ]);

  readonly previewScore = computed(
    () =>
      this.fields().length +
      this.statuses().length +
      this.functions().length +
      this.customEntityRecords().length,
  );

  readonly definitionColumns = computed<PoTableColumn[]>(() => [
    { property: 'key', label: this.literals().columns.key },
    { property: 'name', label: this.literals().columns.name },
  ]);

  readonly recordColumns = computed<PoTableColumn[]>(() => [
    { property: 'key', label: this.literals().columns.key },
    { property: 'name', label: this.literals().columns.name },
  ]);

  readonly fieldColumns = computed<PoTableColumn[]>(() => [
    { property: 'key', label: this.literals().columns.key },
    { property: 'name', label: this.literals().columns.name },
    { property: 'typeLabel', label: this.literals().columns.type },
    { property: 'displayOrder', label: this.literals().columns.order },
    { property: 'isActive', label: this.literals().columns.active, type: 'boolean' },
  ]);

  readonly statusColumns = computed<PoTableColumn[]>(() => [
    { property: 'key', label: this.literals().columns.key },
    { property: 'name', label: this.literals().columns.name },
    { property: 'displayOrder', label: this.literals().columns.order },
    { property: 'isActive', label: this.literals().columns.active, type: 'boolean' },
  ]);

  readonly functionColumns = computed<PoTableColumn[]>(() => [
    { property: 'key', label: this.literals().columns.key },
    { property: 'name', label: this.literals().columns.name },
    { property: 'firstStepLabel', label: this.literals().columns.step },
    { property: 'isActive', label: this.literals().columns.active, type: 'boolean' },
  ]);

  readonly definitionActions = computed<PoTableAction[]>(() => [
    {
      label: this.common().edit,
      action: (row: CustomEntityResponse) => this.openDefinitionForm(row),
    },
    {
      label: this.literals().actions.delete,
      action: (row: CustomEntityResponse) => this.deleteDefinition(row.id),
    },
  ]);

  readonly fieldActions = computed<PoTableAction[]>(() => [
    {
      label: this.common().edit,
      action: (row: CustomFieldResponse) => this.openFieldForm(row),
    },
    {
      label: this.literals().actions.activate,
      action: (row: CustomFieldResponse) => this.activateField(row.id),
      visible: (row: CustomFieldResponse) => !row.isActive,
    },
    {
      label: this.literals().actions.deactivate,
      action: (row: CustomFieldResponse) => this.deactivateField(row.id),
      visible: (row: CustomFieldResponse) => row.isActive,
    },
  ]);

  readonly statusActions = computed<PoTableAction[]>(() => [
    {
      label: this.common().edit,
      action: (row: CustomStatusResponse) => this.openStatusForm(row),
    },
    {
      label: this.literals().actions.activate,
      action: (row: CustomStatusResponse) => this.activateStatus(row.id),
      visible: (row: CustomStatusResponse) => !row.isActive,
    },
    {
      label: this.literals().actions.deactivate,
      action: (row: CustomStatusResponse) => this.deactivateStatus(row.id),
      visible: (row: CustomStatusResponse) => row.isActive,
    },
  ]);

  readonly functionActions = computed<PoTableAction[]>(() => [
    {
      label: this.common().edit,
      action: (row: CustomFunctionResponse) => this.openFunctionForm(row),
    },
    {
      label: this.literals().actions.activate,
      action: (row: CustomFunctionResponse) => this.activateFunction(row.id),
      visible: (row: CustomFunctionResponse) => !row.isActive,
    },
    {
      label: this.literals().actions.deactivate,
      action: (row: CustomFunctionResponse) => this.deactivateFunction(row.id),
      visible: (row: CustomFunctionResponse) => row.isActive,
    },
  ]);

  readonly functionRows = computed(() =>
    this.functions().map((item) => ({
      ...item,
      firstStepLabel: item.steps[0] ? this.getStepTypeLabel(item.steps[0].type) : this.common().notInformed,
    })),
  );

  readonly fieldRows = computed(() =>
    [...this.fields()]
      .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name))
      .map((item) => ({
        ...item,
        typeLabel: this.getFieldTypeLabel(item.type),
      })),
  );

  readonly recordActions = computed<PoTableAction[]>(() => [
    {
      label: this.common().edit,
      action: (row: CustomEntityRecordResponse) => this.openRecordForm(row),
    },
    {
      label: this.literals().actions.delete,
      action: (row: CustomEntityRecordResponse) => this.deleteRecord(row.id),
    },
  ]);

  readonly definitionForm = this.formBuilder.nonNullable.group({
    id: [''],
    key: ['', [Validators.required]],
    name: ['', [Validators.required]],
  });

  readonly recordForm = this.formBuilder.nonNullable.group({
    key: ['', [Validators.required]],
    name: ['', [Validators.required]],
    values: [''],
  });

  readonly fieldForm = this.formBuilder.nonNullable.group({
    key: ['', [Validators.required]],
    name: ['', [Validators.required]],
    type: [CustomFieldType.Text, [Validators.required]],
    isRequired: [false],
    mask: [''],
    options: [''],
    displayOrder: [1, [Validators.required]],
    isFilterable: [false],
    isVisibleInList: [true],
    referenceEntityName: [''],
  });

  readonly statusForm = this.formBuilder.nonNullable.group({
    key: ['', [Validators.required]],
    name: ['', [Validators.required]],
    color: ['#0C9ABE'],
    displayOrder: [1, [Validators.required]],
    isInitial: [false],
    isFinal: [false],
    isCanceled: [false],
  });

  readonly functionForm = this.formBuilder.nonNullable.group({
    key: ['', [Validators.required]],
    name: ['', [Validators.required]],
    stepType: [CustomFunctionStepType.SetCustomField, [Validators.required]],
    targetFieldKey: [''],
    valueExpression: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadAll();
  }

  selectSection(section: CustomizationSection): void {
    this.activeSection.set(section);
  }

  openDefinitionForm(item?: CustomEntityResponse): void {
    this.modalService.open(CustomEntityModalComponent, { item }).subscribe((result) => {
      if (result?.confirmed) {
        this.loadDefinitions();
      }
    });
  }

  openRecordForm(item?: CustomEntityRecordResponse): void {
    const customEntityId = item?.customEntityId ?? this.selectedCustomEntityId() ?? String(this.customEntityOptions()[0]?.value ?? '');

    if (!customEntityId) {
      return;
    }

    this.modalService.open(CustomRecordModalComponent, { customEntityId, customEntityOptions: this.customEntityOptions(), item }).subscribe((result) => {
      if (result?.confirmed) {
        this.selectedCustomEntityId.set(result.customEntityId);
        this.loadRecords(result.customEntityId);
      }
    });
  }

  openFieldForm(item?: CustomFieldResponse): void {
    const scope = this.getSelectedFieldScope();
    const scopedEntity = this.catalog().find((item) => item.name === scope.entityName);

    this.modalService
      .open(CustomFieldModalComponent, {
        entityName: scope.entityName,
        customEntityId: scope.customEntityId,
        item,
        referenceTargets: this.referenceTargetOptions(),
      })
      .subscribe((result) => {
        if (result?.confirmed) {
          this.loadSelectedFieldScope();
        }
      });
  }

  openStatusForm(item?: CustomStatusResponse): void {
    const scope = this.getSelectedStatusScope();

    this.modalService
      .open(CustomStatusModalComponent, { entityName: scope.entityName, customEntityId: scope.customEntityId, item })
      .subscribe((result) => {
        if (result?.confirmed) {
          this.loadSelectedStatusScope();
        }
      });
  }

  openFunctionForm(item?: CustomFunctionResponse): void {
    const scope = this.getSelectedFunctionScope();

    forkJoin({
      fields: this.customizationService.getFields(scope.entityName, scope.customEntityId),
      statuses: this.customizationService.getStatuses(scope.entityName, scope.customEntityId),
    }).subscribe(({ fields, statuses }) => {
      this.modalService
        .open(CustomFunctionModalComponent, {
          entityName: scope.entityName,
          customEntityId: scope.customEntityId,
          fields,
          statuses,
          item,
        })
        .subscribe((result) => {
          if (result?.confirmed) {
            this.loadSelectedFunctionScope();
          }
        });
      });
  }

  shouldSelectStatusValue(): boolean {
    return this.functionForm.controls.stepType.value === CustomFunctionStepType.UpdateStatus;
  }

  onEntityChange(entityName: string): void {
    this.selectedEntityName.set(entityName);
    this.loadCustomization(entityName);
  }

  onFieldScopeChange(scope: string): void {
    this.selectedFieldScope.set(scope);
    this.loadSelectedFieldScope();
  }

  onStatusScopeChange(scope: string): void {
    this.selectedStatusScope.set(scope);
    this.loadSelectedStatusScope();
  }

  onFunctionScopeChange(scope: string): void {
    this.selectedFunctionScope.set(scope);
    this.loadSelectedFunctionScope();
  }

  selectCustomEntity(id: string): void {
    this.selectedCustomEntityId.set(id);
    this.loadRecords(id);
  }

  saveDefinition(): void {
    if (this.definitionForm.invalid) {
      this.definitionForm.markAllAsTouched();
      return;
    }

    const rawValue = this.definitionForm.getRawValue();
    const request: CustomEntityRequest = { key: rawValue.key, name: rawValue.name };
    const operation: Observable<string | void> = rawValue.id
      ? this.customizationService.updateCustomEntity(rawValue.id, request)
      : this.customizationService.createCustomEntity(request);

    this.loading.set(true);
    operation.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.notification.success(
          rawValue.id ? this.literals().notifications.updated : this.literals().notifications.created,
        );
        this.definitionForm.reset();
        this.showDefinitionForm.set(false);
        this.loadDefinitions();
      },
    });
  }

  fillDefinition(row: CustomEntityResponse): void {
    this.showDefinitionForm.set(true);
    this.definitionForm.setValue({
      id: row.id,
      key: row.key,
      name: row.name,
    });
  }

  deleteDefinition(id: string): void {
    this.loading.set(true);
    this.customizationService
      .deleteCustomEntity(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.deleted);
          this.loadDefinitions();
        },
      });
  }

  saveRecord(): void {
    const customEntityId = this.selectedCustomEntityId();

    if (!customEntityId || this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }

    const rawValue = this.recordForm.getRawValue();
    const request: CustomEntityRecordRequest = {
      key: rawValue.key,
      name: rawValue.name,
      customFields: this.parseFieldValues(rawValue.values),
    };

    this.loading.set(true);
    this.customizationService
      .createCustomEntityRecord(customEntityId, request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.created);
          this.recordForm.reset();
          this.showRecordForm.set(false);
          this.loadRecords(customEntityId);
        },
      });
  }

  deleteRecord(id: string): void {
    const customEntityId = this.selectedCustomEntityId();

    if (!customEntityId) {
      return;
    }

    this.loading.set(true);
    this.customizationService
      .deleteCustomEntityRecord(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.deleted);
          this.loadRecords(customEntityId);
        },
      });
  }

  saveField(): void {
    const scope = this.getSelectedFieldScope();

    if (!this.supportsFieldScope() || this.fieldForm.invalid) {
      this.fieldForm.markAllAsTouched();
      return;
    }

    const rawValue = this.fieldForm.getRawValue();
    const request: CreateCustomFieldRequest = {
      entityName: scope.entityName,
      customEntityId: scope.customEntityId,
      name: rawValue.name,
      type: rawValue.type,
      isRequired: rawValue.isRequired,
      mask: rawValue.mask || null,
      options: this.parseOptions(rawValue.options),
      displayOrder: rawValue.displayOrder,
      isFilterable: rawValue.isFilterable,
      isVisibleInList: rawValue.isVisibleInList,
      referenceEntityName: rawValue.referenceEntityName || null,
    };

    this.loading.set(true);
    this.customizationService
      .createField(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.created);
          this.fieldForm.reset({ type: CustomFieldType.Text, displayOrder: 1, isVisibleInList: true });
          this.showFieldForm.set(false);
          this.loadSelectedFieldScope();
        },
      });
  }

  saveStatus(): void {
    const scope = this.getSelectedStatusScope();

    if (!this.supportsStatusScope() || this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    const rawValue = this.statusForm.getRawValue();
    const request: CreateCustomStatusRequest = {
      entityName: scope.entityName,
      customEntityId: scope.customEntityId,
      key: rawValue.key,
      name: rawValue.name,
      color: rawValue.color || null,
      displayOrder: rawValue.displayOrder,
      isInitial: rawValue.isInitial,
      isFinal: rawValue.isFinal,
      isCanceled: rawValue.isCanceled,
    };

    this.loading.set(true);
    this.customizationService
      .createStatus(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.created);
          this.statusForm.reset({ color: '#0C9ABE', displayOrder: 1 });
          this.showStatusForm.set(false);
          this.loadSelectedStatusScope();
        },
      });
  }

  saveFunction(): void {
    const scope = this.getSelectedFunctionScope();

    if (!this.supportsFunctionScope() || this.functionForm.invalid) {
      this.functionForm.markAllAsTouched();
      return;
    }

    const rawValue = this.functionForm.getRawValue();
    const request: CreateCustomFunctionRequest = {
      entityName: scope.entityName,
      customEntityId: scope.customEntityId,
      key: rawValue.key,
      name: rawValue.name,
      inputs: [],
      steps: [
        {
          type: rawValue.stepType,
          targetFieldKey:
            rawValue.stepType === CustomFunctionStepType.SetCustomField
              ? rawValue.targetFieldKey || null
              : null,
          valueExpression: rawValue.valueExpression,
          executionOrder: 1,
          conditionLogic: CustomFunctionConditionLogic.And,
          conditions: [],
        },
      ],
      validations: [],
      allowedCustomRoleNames: [],
    };

    this.loading.set(true);
    this.customizationService
      .createFunction(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.created);
          this.functionForm.reset({ stepType: CustomFunctionStepType.SetCustomField });
          this.showFunctionForm.set(false);
          this.loadSelectedFunctionScope();
        },
      });
  }

  getFieldTypeLabel(type: CustomFieldType): string {
    const option = this.fieldTypeOptions().find((item) => item.value === type);
    return option?.label ?? String(type);
  }

  getStepTypeLabel(type: CustomFunctionStepType | string): string {
    if (type === CustomFunctionStepType.SetCustomField || type === 'SetCustomField') {
      return this.literals().stepTypes.setCustomField;
    }

    if (type === CustomFunctionStepType.UpdateStatus || type === 'UpdateStatus') {
      return this.literals().stepTypes.updateStatus;
    }

    return String(type);
  }

  getEntityDisplayName(entityName: string): string {
    return this.catalog().find((entity) => entity.name === entityName)?.displayName ?? entityName;
  }

  supports(feature: EntityFeature): boolean {
    const entity = this.selectedEntity();

    if (!entity) {
      return false;
    }

    if (feature === 'fields') {
      return entity.supportsCustomFields;
    }

    if (feature === 'statuses') {
      return entity.supportsCustomStatuses;
    }

    return entity.supportsCustomFunctions;
  }

  supportsFieldScope(): boolean {
    return this.fieldScopeOptions().some((item) => item.value === this.selectedFieldScope());
  }

  supportsStatusScope(): boolean {
    return this.statusScopeOptions().some((item) => item.value === this.selectedStatusScope());
  }

  supportsFunctionScope(): boolean {
    return this.functionScopeOptions().some((item) => item.value === this.selectedFunctionScope());
  }

  private loadAll(): void {
    this.loading.set(true);

    this.customizationService
      .getCustomizableEntities()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (catalog) => {
          this.catalog.set(catalog);

          if (!catalog.some((entity) => entity.name === this.selectedEntityName())) {
            this.selectedEntityName.set(catalog[0]?.name ?? '');
          }

          this.loadDefinitions();
          this.loadCustomization(this.selectedEntityName());
        },
      });
  }

  private getCreateAction(): PoPageAction | null {
    switch (this.activeSection()) {
      case 'definitions':
        return {
          label: this.literals().actions.createDefinition,
          icon: 'an an-plus',
          type: 'primary',
          action: () => this.openDefinitionForm(),
          disabled: this.loading(),
        };
      case 'fields':
        return {
          label: this.literals().actions.createField,
          icon: 'an an-plus',
          type: 'primary',
          action: () => this.openFieldForm(),
          disabled: this.loading() || !this.supportsFieldScope(),
        };
      case 'statuses':
        return {
          label: this.literals().actions.createStatus,
          icon: 'an an-plus',
          type: 'primary',
          action: () => this.openStatusForm(),
          disabled: this.loading() || !this.supportsStatusScope(),
        };
      case 'functions':
        return {
          label: this.literals().actions.createFunction,
          icon: 'an an-plus',
          type: 'primary',
          action: () => this.openFunctionForm(),
          disabled: this.loading() || !this.supportsFunctionScope(),
        };
      case 'records':
        return {
          label: this.literals().actions.createRecord,
          icon: 'an an-plus',
          type: 'primary',
          action: () => this.openRecordForm(),
          disabled: this.loading() || !this.selectedCustomEntityId(),
        };
      default:
        return null;
    }
  }

  private loadDefinitions(): void {
    this.customizationService.getCustomEntities().subscribe({
      next: (items) => {
        this.customEntities.set(items);

        const selectedId = this.selectedCustomEntityId();
        const nextSelectedId = items.some((item) => item.id === selectedId)
          ? selectedId
          : (items[0]?.id ?? null);

        this.selectedCustomEntityId.set(nextSelectedId);
        this.ensureSelectedFieldScope();
        this.ensureSelectedStatusScope();
        this.ensureSelectedFunctionScope();
        this.loadSelectedFieldScope();
        this.loadSelectedStatusScope();
        this.loadSelectedFunctionScope();

        if (nextSelectedId) {
          this.loadRecords(nextSelectedId);
        } else {
          this.customEntityRecords.set([]);
        }
      },
    });
  }

  private ensureSelectedFieldScope(): void {
    const options = this.fieldScopeOptions();

    if (!options.some((item) => item.value === this.selectedFieldScope())) {
      this.selectedFieldScope.set(String(options[0]?.value ?? 'entity:Order'));
    }
  }

  private ensureSelectedStatusScope(): void {
    const options = this.statusScopeOptions();

    if (!options.some((item) => item.value === this.selectedStatusScope())) {
      this.selectedStatusScope.set(String(options[0]?.value ?? 'entity:Order'));
    }
  }

  private ensureSelectedFunctionScope(): void {
    const options = this.functionScopeOptions();

    if (!options.some((item) => item.value === this.selectedFunctionScope())) {
      this.selectedFunctionScope.set(String(options[0]?.value ?? 'entity:Order'));
    }
  }

  private loadCustomization(entityName: string): void {
    if (!entityName) {
      return;
    }

    const entity = this.selectedEntity();

    forkJoin({
      fields: this.supportsFieldScope() ? this.getFieldsForSelectedFieldScope() : of([]),
      statuses: this.supportsStatusScope() ? this.getStatusesForSelectedStatusScope() : of([]),
      functions: this.supportsFunctionScope() ? this.getFunctionsForSelectedFunctionScope() : of([]),
    }).subscribe({
      next: ({ fields, statuses, functions }) => {
        this.fields.set(fields);
        this.statuses.set(statuses);
        this.functions.set(functions);
      },
    });
  }

  private loadFields(entityName: string, customEntityId: string | null = null): void {
    this.customizationService.getFields(entityName, customEntityId).subscribe({
      next: (items) => this.fields.set(items),
    });
  }

  private loadSelectedFieldScope(): void {
    const scope = this.getSelectedFieldScope();

    this.loadFields(scope.entityName, scope.customEntityId);
  }

  private getFieldsForSelectedFieldScope(): Observable<CustomFieldResponse[]> {
    const scope = this.getSelectedFieldScope();

    return this.customizationService.getFields(scope.entityName, scope.customEntityId);
  }

  private loadStatuses(entityName: string, customEntityId: string | null = null): void {
    this.customizationService.getStatuses(entityName, customEntityId).subscribe({
      next: (items) => this.statuses.set(items),
    });
  }

  private loadSelectedStatusScope(): void {
    const scope = this.getSelectedStatusScope();

    this.loadStatuses(scope.entityName, scope.customEntityId);
  }

  private getStatusesForSelectedStatusScope(): Observable<CustomStatusResponse[]> {
    const scope = this.getSelectedStatusScope();

    return this.customizationService.getStatuses(scope.entityName, scope.customEntityId);
  }

  private loadFunctions(entityName: string, customEntityId: string | null = null): void {
    this.customizationService.getFunctions(entityName, customEntityId).subscribe({
      next: (items) => this.functions.set(items),
    });
  }

  private loadSelectedFunctionScope(): void {
    const scope = this.getSelectedFunctionScope();

    this.loadFunctions(scope.entityName, scope.customEntityId);
  }

  private getFunctionsForSelectedFunctionScope(): Observable<CustomFunctionResponse[]> {
    const scope = this.getSelectedFunctionScope();

    return this.customizationService.getFunctions(scope.entityName, scope.customEntityId);
  }

  private loadRecords(customEntityId: string): void {
    this.customizationService.getCustomEntityRecords(customEntityId).subscribe({
      next: (items) => this.customEntityRecords.set(items),
    });
  }

  private getSelectedFieldScope(): CustomizationScope {
    return this.parseScope(this.selectedFieldScope());
  }

  private getSelectedStatusScope(): CustomizationScope {
    return this.parseScope(this.selectedStatusScope());
  }

  private getSelectedFunctionScope(): CustomizationScope {
    return this.parseScope(this.selectedFunctionScope());
  }

  private parseScope(value: string): CustomizationScope {

    if (value.startsWith('custom:')) {
      return {
        entityName: 'CustomEntityRecord',
        customEntityId: value.replace('custom:', ''),
      };
    }

    return {
      entityName: value.replace('entity:', ''),
      customEntityId: null,
    };
  }

  private activateField(id: string): void {
    this.customizationService.activateField(id).subscribe({
      next: () => {
        this.notification.success(this.literals().notifications.statusChanged);
        this.loadSelectedFieldScope();
      },
    });
  }

  private deactivateField(id: string): void {
    this.customizationService.deactivateField(id).subscribe({
      next: () => {
        this.notification.success(this.literals().notifications.statusChanged);
        this.loadSelectedFieldScope();
      },
    });
  }

  private activateStatus(id: string): void {
    this.customizationService.activateStatus(id).subscribe({
      next: () => {
        this.notification.success(this.literals().notifications.statusChanged);
        this.loadSelectedStatusScope();
      },
    });
  }

  private deactivateStatus(id: string): void {
    this.customizationService.deactivateStatus(id).subscribe({
      next: () => {
        this.notification.success(this.literals().notifications.statusChanged);
        this.loadSelectedStatusScope();
      },
    });
  }

  private activateFunction(id: string): void {
    this.customizationService.activateFunction(id).subscribe({
      next: () => {
        this.notification.success(this.literals().notifications.statusChanged);
        this.loadSelectedFunctionScope();
      },
    });
  }

  private deactivateFunction(id: string): void {
    this.customizationService.deactivateFunction(id).subscribe({
      next: () => {
        this.notification.success(this.literals().notifications.statusChanged);
        this.loadSelectedFunctionScope();
      },
    });
  }

  private parseOptions(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  private parseFieldValues(value: string): { fieldKey: string; value: string }[] {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.includes('='))
      .map((line) => {
        const separatorIndex = line.indexOf('=');

        return {
          fieldKey: line.substring(0, separatorIndex).trim(),
          value: line.substring(separatorIndex + 1).trim(),
        };
      });
  }
}
