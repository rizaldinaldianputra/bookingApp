export interface Room {
  id: number;
  nama: string;
  created_at: string;
}

export interface RoomResponse {
  success: boolean;
  data: Room[];
}
