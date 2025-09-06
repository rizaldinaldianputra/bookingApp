// models/katalogproduct.ts
export interface Gambar {
  id_gambar: number;
  id_produk: number;
  url_gambar: string;
  created_at: string;
  updated_at: string;
}

export interface KatalogProduct {
  id_produk: number;
  judul_produk: string;
  deskripsi: string | null;
  harga: string;
  id_kategori: number;
  created_at: string;
  updated_at: string;
  gambar: Gambar[];
}

export interface KatalogProductResponse {
  success: boolean;
  data: KatalogProduct[];
}
