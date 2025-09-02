export interface Pembayaran {
  pembayaran_id: number;
  kode_pembayaran: string;
  transaksi_id: number;
  tanggal: string;
  jenis_bayar: string;
  tipe_bayar: string;
  keterangan: string;
  nominal: number;
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
  fasilitas_ids: string[]; // JSON.parse dari string
  deskripsi: string;
  jenis_kos: string;
  tipe_sewa: string;
  dekat_dengan: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaksi {
  id: number;
  quantity: number;
  user_id: number;
  no_order: string;
  tanggal: string;
  start_order_date: string;
  end_order_date: string;
  kos_id: number;
  kamar_id: number;
  paket_id: number;
  harga: number;
  status: string;
  created_at: string;
  updated_at: string;
  pembayaran: Pembayaran[];
  kos: Kos;
  kamar: Kamar;
}

export interface TransaksiResponse {
  success: boolean;
  message: string;
  data: Transaksi[];
}
