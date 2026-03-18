import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { getValidToken, logout } from './auth';
import { User } from '../types';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await getValidToken();
  if (!token) {
    await logout();
    throw new Error('UNAUTHENTICATED');
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) throw new Error('NETWORK_ERROR');
    if (error.response.status === 404) throw new Error('USER_NOT_FOUND');
    if (error.response.status === 401) throw new Error('UNAUTHORIZED');
    throw new Error('SERVER_ERROR');
  }
);

export async function getUser(login: string): Promise<User> {
  const { data } = await api.get<User>(`/users/${login}`);
  return data;
}
