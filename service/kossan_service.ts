// kossan_service.ts
import { DetailKamarResponse } from '@/models/detail_kamar_kossan';
import { DetailKosResponse } from '@/models/detail_kossan';
import { DetailKosLokasiResponse } from '@/models/kos_by_lokasi';
import { RoomResponse } from '@/models/typekos';
import { KamarResponse } from '../models/kossan'; // Ini adalah KamarResponse yang memiliki success, data, meta
import { getRequest } from './main_service';

export type GetKosParams = {
  daerah?: string;
  durasi?: string;
  jenis?: string;
  start_date?: string;
  end_date?: string;
};

export type GetKosParamsLokasi = {
  id?: string;
};

export const getKos = (params: GetKosParams) => getRequest<KamarResponse>('/api/getKos', params);

export const getKosByLokasi = (id: string) =>
  getRequest<DetailKosLokasiResponse>(`/api/kos?daerah=${id}`);
export const getKosById = (id: string) => getRequest<DetailKosResponse>(`/api/getKos/${id}`);

export const getKosByIdByKamar = (idKossan: string, idKamar: string) =>
  getRequest<DetailKamarResponse>(`/api/getKamar/${idKossan}/kamar/${idKamar}`);

export const getTipekos = () => getRequest<RoomResponse>('/api/getTipekos');
