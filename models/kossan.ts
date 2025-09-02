export interface Ketersediaan {
  start_date: string;
  end_date: string;
}

export interface PaketHarga {
  perharian_harga: number;
  perbulan_harga: number;
  pertigabulan_harga: number;
  perenambulan_harga: number;
  pertahun_harga: number;
  ketersediaan: Ketersediaan[] | string; // bisa array atau string JSON
}

export interface Kamar {
  id: number;
  nama_kamar: string;
  jenis_kos: string;
  nama_kos: string;
  lokasi_kos: string;
  tipe_kos: string;
  lantai: string;
  fasilitas: string; // bentuknya string JSON, bisa kamu parse jadi string[]
  created_at: string;
  paket_harga: PaketHarga | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface KamarResponse {
  success: boolean;
  data: Kamar[];
  meta: PaginationMeta;
}
