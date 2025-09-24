import { TagihanResponse } from '@/models/tagihan';
import { BookingData, BookingResponse } from '@/models/transaksi_kossan';
import { TransaksiResponse } from '@/models/transansaksi';
import { getRequest, postRequest } from './main_service';

export const getTransaksi = (userId: string) =>
  getRequest<TransaksiResponse>(`/api/transaksi/user/${userId}`);

export const postTransaksi = (payload: BookingData) =>
  postRequest<BookingResponse>('/api/transaksi', payload);

export const getTagihanById = (id: string) => getRequest<TagihanResponse>(`/api/pembayaran/${id}`);
