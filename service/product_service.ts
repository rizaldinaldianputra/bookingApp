import { KatalogProductResponse } from '@/models/katalogproduct';
import { TransaksiProdukResponse } from '@/models/product';
import { getRequest } from './main_service';

export const getTransaksiProduct = (userId: string) =>
  getRequest<TransaksiProdukResponse>(`/api/transaksi-produk/user/${userId}`);

// src/service/product_service.ts

export const getProduct = () => getRequest<KatalogProductResponse>('/api/getProduk');
