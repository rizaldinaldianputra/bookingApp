import { TransaksiResponse } from '@/models/transansaksi';
import { getRequest } from './main_service';

export const getTransaksi = (userId: string) =>
  getRequest<TransaksiResponse>(`/api/transaksi/user/${userId}`);
