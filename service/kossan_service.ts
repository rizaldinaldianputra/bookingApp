// kossan_service.ts
import { KamarResponse } from '../models/kossan'; // Ini adalah KamarResponse yang memiliki success, data, meta
import { getRequest } from './main_service';

interface GetKosParams {
  start_date?: string;
  end_date?: string;
  per_page?: number;
  search?: string;
  current_page?: number;
  lokasi_kos?: string;
  jenis_kos?: string;
  fasilitas?: string;
  min_harga?: number;
  max_harga?: number;
}

export const getKos = (params: GetKosParams) => getRequest<KamarResponse>('/api/getKos', params); // <- Langsung objek `params` dari GetKosParams
