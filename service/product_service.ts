import { TransaksiProdukResponse } from '@/models/product';
import { getRequest } from './main_service';

export const getTransaksiProduct = (userId: string) =>
  getRequest<TransaksiProdukResponse>(`/api/transaksi-produk/user/${userId}`);
