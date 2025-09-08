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

export interface Produk {
  id_produk: number;
  judul_produk: string;
  deskripsi: string | null;
  harga: string;
  id_kategori: number;
  created_at: string;
  updated_at: string;
}

export interface TransaksiData {
  no_order: string;
  id_user: number;
  id_produk: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  tanggal_transaksi: string;
  status: string;
  updated_at: string;
  created_at: string;
  id_transaksi: number;
  user: User;
  produk: Produk;
}

export interface TransaksiResponse {
  success: boolean;
  message: string;
  data: TransaksiData;
}

export interface TransaksiPayload {
  id_user: number;
  id_produk: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  tanggal_transaksi: string;
  status: string;
}
