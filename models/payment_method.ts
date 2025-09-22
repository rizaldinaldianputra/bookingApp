// models/payment_method.ts
export interface Fee {
  flat: number;
  percent: number | string;
}

export interface PaymentMethod {
  group: string;
  code: string;
  name: string;
  type: string;
  fee_merchant: Fee;
  fee_customer: Fee;
  total_fee: Fee;
  minimum_fee: number | null;
  maximum_fee: number | null;
  minimum_amount: number;
  maximum_amount: number;
  icon_url: string;
  active: boolean;
}

export interface PaymentMethodResponse {
  success: boolean;
  data: PaymentMethod[];
}
