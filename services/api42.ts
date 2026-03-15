import axios, { AxiosInstance } from 'axios';
import { User, UserError } from '../types';
import { API_BASE_URL } from '../constants/api';
import { getValidToken, refreshToken } from './auth';
import { getToken } from './storage';

let api: AxiosInstance | null = null;

async function initializeApiClient(): Promise<AxiosInstance> {
  if (api) return api;

  api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(
    async (config) => {
      const token = await getValidToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken && error.config) {
          error.config.headers.Authorization = `Bearer ${newToken.access_token}`;
          return api!(error.config);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}

export async function getUser(login: string): Promise<User> {
  try {
    const client = await initializeApiClient();
    const response = await client.get<User>(`/users/${login}`);
    return response.data;
  } catch (error) {
    const err: UserError = {
      type: 'UNKNOWN',
      message: 'Failed to fetch user data',
    };

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        err.type = 'NETWORK';
        err.message = 'Network error. Please check your connection.';
      } else if (error.response.status === 404) {
        err.type = 'NOT_FOUND';
        err.message = `User "${login}" not found.`;
      } else if (error.response.status === 401) {
        err.type = 'UNAUTHORIZED';
        err.message = 'Your session has expired. Please login again.';
      } else if (error.response.status >= 500) {
        err.type = 'SERVER_ERROR';
        err.message = 'Server error. Please try again later.';
      }
    }

    throw err;
  }
}
