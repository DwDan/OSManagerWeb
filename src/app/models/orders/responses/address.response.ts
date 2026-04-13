export interface AddressResponse {
  postalCode: string;
  scheduledAt: Date;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
  reference?: string;
}
