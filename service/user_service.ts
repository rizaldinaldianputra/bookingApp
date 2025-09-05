import { User } from '../models/user';
import { getRequest } from './main_service';

export const getUsers = () => getRequest<{ success: boolean; user: User }>('/api/account');
