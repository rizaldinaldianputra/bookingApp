import { User } from './user';

export interface Produk {
  id_produk: number;
  judul_produk: string;
  deskripsi: string | null;
  harga: string;
  id_kategori: number;
  created_at: string;
  updated_at: string;
}

export interface TransaksiProduk {
  id_transaksi: number;
  no_order: string;
  id_user: number;
  id_produk: number;
  jumlah: number;
  harga_satuan: string;
  subtotal: string;
  tanggal_transaksi: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: User;
  produk: Produk;
}

export interface TransaksiProdukResponse {
  success: boolean;
  message: string;
  data: TransaksiProduk[];
}
