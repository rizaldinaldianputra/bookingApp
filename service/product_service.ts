import { KatalogProductResponse } from '@/models/katalogproduct';
import { KatalogProductByIdResponse } from '@/models/katalogproductbyid';
import { TransaksiProdukResponse } from '@/models/product';
import { TransaksiPayload, TransaksiResponse } from '@/models/transaksi_product';
import { getRequest, postRequest } from './main_service';

export const getTransaksiProduct = (userId: string) =>
  getRequest<TransaksiProdukResponse>(`/api/transaksi-produk/user/${userId}`);

// src/service/product_service.ts

export const getProduct = () => getRequest<KatalogProductResponse>('/api/getProduk');
export const getProductById = (id: string) =>
  getRequest<KatalogProductByIdResponse>(`/api/Produk/${id}`);

export const postTransaksiProduct = (payload: TransaksiPayload) =>
  postRequest<TransaksiResponse>('/api/transaksi-produk', payload);
