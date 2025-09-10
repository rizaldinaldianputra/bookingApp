import { LoginResponse } from '@/models/auth';
import { User } from '@/models/user';
import { clearSession, saveToken, saveUser } from '@/session/session';
import { postFormRequest, postRequest } from './main_service';

// Login
export const login = async (email: string, password: string) => {
  const res = await postRequest<LoginResponse>('/api/login', { email, password });
  await saveToken(res.token);
  await saveUser(res.user);
  return res;
};

export const googleLogin = async (email: string, password: string) => {
  const res = await postRequest<LoginResponse>('/api/login', { email, password });
  await saveToken(res.token);
  await saveUser(res.user);
  return res;
};

export const appleLogin = async (email: string, password: string) => {
  const res = await postRequest<LoginResponse>('/api/login', { email, password });
  await saveToken(res.token);
  await saveUser(res.user);
  return res;
};
// Logout
export const logout = async () => {
  await postRequest<{ message: string }>('/auth/logout');
  await clearSession();
};

export const register = (formData: FormData) =>
  postFormRequest<{ success: boolean; message: string; data: User }>('/api/register', formData);
