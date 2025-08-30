import { postRequest } from './service';

interface LoginResponse {
  token: string;
}

// Login
export const login = (username: string, password: string) =>
  postRequest<LoginResponse>('/authenticate', { username, password });

// Logout
export const logout = () => postRequest<{ message: string }>('/auth/logout');
