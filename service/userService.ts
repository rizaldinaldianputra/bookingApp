import { User } from '../models/user';
import { deleteRequest, getRequest, postRequest, putRequest } from './service';

export const getUsers = () => getRequest<User[]>('/users');
export const createUser = (data: Partial<User>) => postRequest<User>('/users', data);
export const updateUser = (id: number, data: Partial<User>) =>
  putRequest<User>(`/users/${id}`, data);
export const deleteUser = (id: number) => deleteRequest<void>(`/users/${id}`);
