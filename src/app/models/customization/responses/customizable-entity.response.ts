export interface CustomizableEntityPropertyResponse {
  key: string;
  type: string;
  isNullable: boolean;
}

export interface CustomizableEntityResponse {
  name: string;
  displayName: string;
  supportsCustomFields: boolean;
  supportsCustomStatuses: boolean;
  supportsCustomFunctions: boolean;
  properties: CustomizableEntityPropertyResponse[];
  referenceTargets: string[];
}
