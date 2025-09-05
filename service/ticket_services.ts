import { Ticket, TicketResponse } from '@/models/ticket';
import { getRequest, postFormRequest } from './main_service';

export const getTicket = (userId: string) =>
  getRequest<TicketResponse>(`/api/tickets/user?user_id=${userId}`);

export const postTicket = (formData: FormData) =>
  postFormRequest<{ success: boolean; message: string; data: Ticket }>('/api/tickets', formData);
