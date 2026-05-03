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

export interface CustomFunctionResponse {
  id: string;
  entityName: string;
  key: string;
  name: string;
  isActive: boolean;
  inputs: CustomFunctionInputResponse[];
  steps: CustomFunctionStepResponse[];
  validations: unknown[];
  allowedCustomRoleNames: string[];
}
