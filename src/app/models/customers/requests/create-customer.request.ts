export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email: string;
  postalCode: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
  reference?: string;
}
