import { LokasiResponse } from '@/models/lokasi';
import { getRequest } from './main_service';

export const getLokasi = () => getRequest<LokasiResponse>('/api/getLokasi');
