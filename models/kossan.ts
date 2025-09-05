export interface Daerah {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
}

export interface Kos {
  id: number;
  nama: string;
  alamat_kota: string;
  daerah_id: number;
  keterangan: string;
  link_maps: string;
  created_at: string;
  updated_at: string;
  daerah: Daerah;
}

export interface Fasilitas {
  id: number;
  nama: string;
}

export interface Ketersediaan {
  start_date: string;
  end_date: string;
}

export interface PaketHarga {
  paket_id: number;
  perharian_harga: number;
  perbulan_harga: number;
  pertigabulan_harga: number;
  perenambulan_harga: number;
  pertahun_harga: number;
  ketersediaan: Ketersediaan[] | string; // bisa array atau string JSON
}

export interface Gallery {
  id: number;
  kamar_id: number;
  nama_file: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface Kamar {
  id: number;
  nama_kamar: string;
  jenis_kos: string;
  kos: Kos;
  lokasi_kos: string;
  tipe_kos: string;
  lantai: string;
  fasilitas: Fasilitas[] | string; // bisa string JSON
  created_at: string;
  paket_harga: PaketHarga | null;
  gallery: Gallery[];
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
