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
  ketersediaan: Ketersediaan[];
}

export interface Fasilitas {
  id: number;
  nama: string;
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
  deskripsi: string;
  tipe_sewa: string;
  tipe_kos: string;
  lantai: string;
  fasilitas: Fasilitas[];
  paket_harga: PaketHarga;
  gallery: Gallery[];
}

export interface DetailKosData {
  id: number;
  nama: string;
  alamat: string;
  daerah: string;
  keterangan: string;
  link_maps: string;
  created_at: string;
  kamar: Kamar[];
}

export interface DetailKosResponse {
  success: boolean;
  data: DetailKosData;
}
