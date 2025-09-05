import { getToken } from '@/session/session';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// interceptor request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken(); // ambil dari session
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.request.use((req) => {
  console.log('REQUEST:', req.data);
  return req;
});

// interceptor response
api.interceptors.response.use(
  (res) => {
    console.log('URL', res.request['responseURL']);
    console.log('RESPONSE:', res.data);
    return res;
  },
  (error) => {
    console.error(error.response?.data['message']);
    return Promise.reject(error);
  },
);

// fungsi dasar
export const getRequest = async <T>(url: string, queryParams?: any): Promise<T> => {
  const response = await api.get<T>(url, { params: queryParams });
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

// 🔥 fungsi khusus FormData
export const postFormRequest = async <T>(url: string, formData: FormData): Promise<T> => {
  const response = await api.post<T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
