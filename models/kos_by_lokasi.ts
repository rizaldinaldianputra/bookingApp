export interface DetailKosLokasiResponse {
  success: boolean;
  data: Kos[];
  meta: Meta;
}

export interface Kos {
  id: number;
  nama: string;
  alamat_kota: string;
  daerah: string;
  keterangan: string;
  link_maps: string;
  created_at: string;
  image: string | null;
}

export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}
