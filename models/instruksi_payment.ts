// models/payment.ts

export interface OrderItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  product_url: string | null;
  image_url: string | null;
}

export interface Instruction {
  title: string;
  steps: string[];
}

export interface PaymentData {
  reference: string;
  merchant_ref: string;
  payment_selection_type: string;
  payment_method: string;
  payment_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  callback_url: string;
  return_url: string;
  amount: number;
  fee_merchant: number;
  fee_customer: number;
  total_fee: number;
  amount_received: number;
  pay_code: string;
  pay_url: string | null;
  checkout_url: string;
  status: string;
  expired_time: number;
  order_items: OrderItem[];
  instructions: Instruction[];
}

export interface PaymentResponse {
  success: boolean;
  data: PaymentData;
  message: string;
}
