import axios from 'axios';
import { BASE_URL } from '../constants/config';

const api = axios.create({
  baseURL: BASE_URL, // ganti dengan base URL API kamu
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// interceptor request (opsional, misalnya tambah token)
api.interceptors.request.use(
  async (config) => {
    // contoh token palsu
    const token = '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// interceptor response (opsional, untuk error handling global)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

// fungsi dasar
export const getRequest = async <T>(url: string, params?: any): Promise<T> => {
  const response = await api.get<T>(url, { params });
  return response.data;
};

export const postRequest = async <T>(url: string, body?: any): Promise<T> => {
  const response = await api.post<T>(url, body);
  return response.data;
};

export const putRequest = async <T>(url: string, body?: any): Promise<T> => {
  const response = await api.put<T>(url, body);
  return response.data;
};

export const deleteRequest = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url);
  return response.data;
};
