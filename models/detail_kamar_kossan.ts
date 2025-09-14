export interface DetailKamarResponse {
  success: boolean;
  data: KamarDetail;
}

export interface KamarDetail {
  id: number;
  nama_kamar: string;
  jenis_kos: string;
  deskripsi: string;
  tipe_sewa: string;
  tipe_kos: string;
  lantai: string;
  kos: Kos;
  fasilitas: Fasilitas[];
  paket_harga: PaketHarga;
  gallery: Gallery[];
}

export interface Kos {
  id: number;
  nama: string;
  link_maps: string;
  daerah: string;
}

export interface Fasilitas {
  id: number;
  nama: string;
}

export interface PaketHarga {
  paket_id: number;
  perharian_harga: number;
  perbulan_harga: number;
  pertigabulan_harga: number;
  perenambulan_harga: number;
  pertahun_harga: number;
  ketersediaan: Ketersediaan[];
}

export interface Ketersediaan {
  start_date: string;
  end_date: string;
}

export interface Gallery {
  id: number;
  kamar_id: number;
  nama_file: string;
  url: string;
  created_at: string;
  updated_at: string;
}
