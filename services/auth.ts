import axios from 'axios';
import { TOKEN_URL, CLIENT_ID, REDIRECT_URI } from '../constants/api';
import { saveToken, getToken, deleteToken } from './storage';
import { Token } from '../types';

export async function exchangeCodeForToken(code: string): Promise<Token> {
  const response = await axios.post(TOKEN_URL, {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
    code,
  });

  const token: Token = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    expires_at: Date.now() + response.data.expires_in * 1000,
  };

  await saveToken(token);
  return token;
}

export async function refreshToken(): Promise<Token | null> {
  try {
    const stored = await getToken();
    if (!stored?.refresh_token) return null;

    const response = await axios.post(TOKEN_URL, {
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      refresh_token: stored.refresh_token,
    });

    const token: Token = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: Date.now() + response.data.expires_in * 1000,
    };

    await saveToken(token);
    return token;
  } catch {
    await deleteToken();
    return null;
  }
}

export async function getValidToken(): Promise<string | null> {
  const token = await getToken();
  if (!token) return null;

  if (token.expires_at < Date.now()) {
    const refreshed = await refreshToken();
    return refreshed?.access_token ?? null;
  }

  return token.access_token;
}

export async function logout(): Promise<void> {
  await deleteToken();
}
