import { LokasiResponse } from '@/models/lokasi';
import { getRequest } from './main_service';

export const getFasilitas = () => getRequest<LokasiResponse>('/api/getFasilitas');
