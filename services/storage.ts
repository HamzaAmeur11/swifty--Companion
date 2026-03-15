import * as SecureStore from 'expo-secure-store';
import { Token } from '../types';

const TOKEN_KEY = 'swifty_token';

export async function saveToken(token: Token): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(token));
  } catch (error) {
    console.error('Failed to save token:', error);
    throw error;
  }
}

export async function getToken(): Promise<Token | null> {
  try {
    const tokenString = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!tokenString) return null;
    return JSON.parse(tokenString) as Token;
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
}

export async function deleteToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to delete token:', error);
    throw error;
  }
}
