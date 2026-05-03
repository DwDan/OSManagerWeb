export interface CustomFieldValueResponse {
  key: string;
  name: string;
  type: string;
  mask?: string | null;
  value?: string | null;
  displayOrder: number;
}
