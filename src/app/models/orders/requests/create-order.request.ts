export interface CreateOrderRequest {
  customerId: string;
  services: string[];
  scheduledAt: Date;
  postalCode: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
  reference?: string;
}
