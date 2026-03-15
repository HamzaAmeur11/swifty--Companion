import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Token, AuthError } from '../types';
import { TOKEN_URL } from '../constants/api';
import { saveToken, getToken, deleteToken } from './storage';

const INTRA_CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;
const INTRA_REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI;

export async function exchangeCodeForToken(code: string): Promise<Token> {
  try {
    const response = await axios.post<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>(TOKEN_URL, {
      grant_type: 'authorization_code',
      code,
      client_id: INTRA_CLIENT_ID,
      redirect_uri: INTRA_REDIRECT_URI,
    });

    const token: Token = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: Date.now() + response.data.expires_in * 1000,
    };

    await saveToken(token);
    return token;
  } catch (error) {
    const err: AuthError = {
      type: 'UNKNOWN',
      message: 'Failed to exchange code for token',
    };

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        err.type = 'NETWORK';
        err.message = 'Network error during authentication';
      } else if (error.response.status === 401) {
        err.type = 'UNAUTHORIZED';
        err.message = 'Invalid credentials';
      }
    }

    throw err;
  }
}

export async function refreshToken(): Promise<Token | null> {
  try {
    const token = await getToken();
    if (!token || !token.refresh_token) {
      return null;
    }

    const response = await axios.post<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>(TOKEN_URL, {
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
      client_id: INTRA_CLIENT_ID,
    });

    const newToken: Token = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: Date.now() + response.data.expires_in * 1000,
    };

    await saveToken(newToken);
    return newToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    await deleteToken();
    return null;
  }
}

export async function isTokenExpired(): Promise<boolean> {
  const token = await getToken();
  if (!token) return true;
  return token.expires_at < Date.now();
}

export async function getValidToken(): Promise<string | null> {
  const token = await getToken();
  if (!token) return null;

  if (token.expires_at < Date.now()) {
    const newToken = await refreshToken();
    if (!newToken) return null;
    return newToken.access_token;
  }

  return token.access_token;
}
