export interface CreateOrderRequest {
  client: string;
  postalCode: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
  reference?: string;
}
