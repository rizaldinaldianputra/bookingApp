import { getToken } from '@/session/session';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '../constants/config';

const createApi = (baseURL: string = BASE_URL) =>
  axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

const api = createApi();

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
  (error: AxiosError<any>) => {
    // ambil message dari backend
    const backendMessage =
      (error.response?.data as any)?.message || error.message || 'Terjadi kesalahan';
    console.error('❌ API ERROR:', backendMessage);

    // bikin error baru supaya konsisten
    return Promise.reject(new Error(backendMessage));
  },
);

// fungsi dasar
export const getRequest = async <T>(
  url: string,
  queryParams?: any,
  baseURL: string = BASE_URL,
): Promise<T> => {
  const client = baseURL === BASE_URL ? api : createApi(baseURL);
  const response = await client.get<T>(url, { params: queryParams });
  return response.data;
};

export const postRequest = async <T>(
  url: string,
  body?: any,
  baseURL: string = BASE_URL,
): Promise<T> => {
  const client = baseURL === BASE_URL ? api : createApi(baseURL);
  const response = await client.post<T>(url, body);
  return response.data;
};

export const putRequest = async <T>(
  url: string,
  body?: any,
  baseURL: string = BASE_URL,
): Promise<T> => {
  const client = baseURL === BASE_URL ? api : createApi(baseURL);
  const response = await client.put<T>(url, body);
  return response.data;
};

export const deleteRequest = async <T>(url: string, baseURL: string = BASE_URL): Promise<T> => {
  const client = baseURL === BASE_URL ? api : createApi(baseURL);
  const response = await client.delete<T>(url);
  return response.data;
};

// 🔥 fungsi khusus FormData
export const postFormRequest = async <T>(
  url: string,
  formData: FormData,
  baseURL: string = BASE_URL,
): Promise<T> => {
  const client = baseURL === BASE_URL ? api : createApi(baseURL);
  const response = await client.post<T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
