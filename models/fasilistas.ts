export interface Fasilitas {
  id: number;
  nama: string;
  created_at: string;
}

export interface FasilitasResponse {
  success: boolean;
  data: Fasilitas[];
}
