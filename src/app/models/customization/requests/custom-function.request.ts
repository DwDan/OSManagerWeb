import { CustomFieldType } from '../types/custom-field-type.enum';
import { CustomFunctionConditionLogic } from '../types/custom-function-condition-logic.enum';
import { CustomFunctionStepType } from '../types/custom-function-step-type.enum';

export interface CreateCustomFunctionInputRequest {
  key: string;
  label: string;
  type: CustomFieldType;
  isRequired: boolean;
  displayOrder: number;
}

export interface CreateCustomFunctionStepRequest {
  type: CustomFunctionStepType;
  targetFieldKey?: string | null;
  valueExpression?: string | null;
  executionOrder: number;
  conditionLogic: CustomFunctionConditionLogic;
  conditions: unknown[];
}

export interface CreateCustomFunctionRequest {
  entityName: string;
  key: string;
  name: string;
  inputs: CreateCustomFunctionInputRequest[];
  steps: CreateCustomFunctionStepRequest[];
  validations: unknown[];
  allowedCustomRoleNames: string[];
}
