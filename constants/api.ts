export const API_BASE_URL = 'https://api.intra.42.fr/v2';
export const AUTH_URL = 'https://api.intra.42.fr/oauth/authorize';
export const TOKEN_URL = 'https://api.intra.42.fr/oauth/token';
export const SCOPES = ['public'];

export const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID ?? '';
export const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI ?? 'swifty-companion://auth';
