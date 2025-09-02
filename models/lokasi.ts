export interface Lokasi {
  id: number;
  nama: string;
  created_at: string;
}

export interface LokasiResponse {
  success: boolean;
  data: Lokasi[];
}
