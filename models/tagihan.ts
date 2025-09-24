// models/Transaksi.ts
export interface Transaksi {
  id: number;
  quantity: number;
  user_id: number;
  no_order: string;
  tanggal: string;
  start_order_date: string | null;
  end_order_date: string | null;
  kos_id: number;
  kamar_id: number;
  paket_id: number;
  harga: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// models/Pembayaran.ts
export interface Pembayaran {
  pembayaran_id: number;
  kode_pembayaran: string;
  transaksi_id: number;
  tanggal: string;
  jenis_bayar: string;
  tipe_bayar: string;
  keterangan: string | null;
  nominal: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TagihanResponse {
  success: boolean;
  transaksi: Transaksi;
  pembayarans: Pembayaran[];
}
