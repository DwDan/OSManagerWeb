import { CustomFieldType } from '../types/custom-field-type.enum';

export interface CustomFunctionInputResponse {
  key: string;
  label: string;
  type: CustomFieldType;
  isRequired: boolean;
  displayOrder: number;
}

export interface CustomFunctionStepResponse {
  type: string;
  targetFieldKey?: string | null;
  valueExpression?: string | null;
  executionOrder: number;
  conditionLogic: string;
  conditions: unknown[];
}

export interface CustomFunctionValidationResponse {
  source: string;
  operator: string;
  fieldKey: string;
  expectedValue?: string | null;
  errorMessage: string;
  executionOrder: number;
}

export interface CustomFunctionResponse {
  id: string;
  entityName: string;
  customEntityId?: string | null;
  key: string;
  name: string;
  isActive: boolean;
  inputs: CustomFunctionInputResponse[];
  steps: CustomFunctionStepResponse[];
  validations: CustomFunctionValidationResponse[];
  allowedCustomRoleNames: string[];
}
