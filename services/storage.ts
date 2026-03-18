import * as SecureStore from 'expo-secure-store';
import { Token } from '../types';

const TOKEN_KEY = 'swifty_token';

export async function saveToken(token: Token): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(token));
}

export async function getToken(): Promise<Token | null> {
  const raw = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as Token;
}

export async function deleteToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
