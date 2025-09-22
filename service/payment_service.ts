import { BASE_URL_PAYMENT } from '@/constants/config';
import { PaymentMethodResponse } from '@/models/payment_method';
import { getRequest, postRequest } from './main_service';

export const getPaymentMethods = async () => {
  return await getRequest<PaymentMethodResponse>(
    '/api/tripay/payment-channels',
    undefined,
    BASE_URL_PAYMENT,
  );
};

export const createPayment = async (payload: any) => {
  return await postRequest<PaymentResponse>(
    '/api/tripay/create-payment',
    payload,
    BASE_URL_PAYMENT,
  );
};
