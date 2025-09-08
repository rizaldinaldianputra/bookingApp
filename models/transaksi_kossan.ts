export interface BookingData {
  user_id: number;
  tanggal: string;
  harga: number;
  quantity: number;
  start_order_date: string;
  end_order_date: string;
  kos_id: number;
  kamar_id: number;
  paket_id: number;
}

export interface User {
  id: number;
  google_id: string | null;
  nama: string;
  nik: string;
  email: string;
  email_verified_at: string | null;
  alamat: string;
  gambarktp: string;
  fotoselfie: string;
  status: string;
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
}

export interface Kamar {
  id: number;
  nama: string;
  kos_id: number;
  tipe_kos_id: number;
  quantity: number;
  lantai_id: number;
  fasilitas_ids: string;
  deskripsi: string;
  jenis_kos: string;
  tipe_sewa: string;
  dekat_dengan: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingDataResponse {
  user_id: number;
  no_order: string;
  tanggal: string;
  start_order_date: string;
  end_order_date: string;
  kos_id: number;
  kamar_id: number;
  paket_id: number;
  harga: number;
  quantity: number;
  status: string;
  updated_at: string;
  created_at: string;
  id: number;
  user: User;
  kos: Kos;
  kamar: Kamar;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: BookingDataResponse;
}
