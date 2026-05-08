export interface CustomFieldValueResponse {
  key: string;
  name: string;
  type: string;
  mask?: string | null;
  value?: string | null;
  displayValue?: string | null;
  displayOrder: number;
}
