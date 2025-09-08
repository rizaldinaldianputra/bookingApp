// models/katalogproductbyid.ts

export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

export interface Gambar {
  id_gambar: number;
  url_gambar: string;
}

export interface KatalogProductById {
  id_produk: number;
  judul_produk: string;
  deskripsi: string | null;
  harga: string;
  id_kategori: number;
  kategori: Kategori;
  gambar: Gambar[];
  created_at: string;
}

export interface KatalogProductByIdResponse {
  success: boolean;
  data: KatalogProductById;
}
