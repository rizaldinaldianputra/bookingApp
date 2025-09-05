// models/Ticket.ts

export interface Ticket {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  status: string;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketMeta {
  count: number;
  timestamp: string;
}

export interface TicketResponse {
  success: boolean;
  data: Ticket[];
  meta: TicketMeta;
}
