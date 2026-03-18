import axios from 'axios';
import Constants from 'expo-constants';

// ─── Read credentials — works on both web and Expo Go mobile ───────────────
//
// On web:       Constants.expoConfig.extra is populated
// On Expo Go:   Constants.manifest2?.extra?.expoClient?.extra  (SDK 45+)
//               Constants.manifest?.extra                       (older)
// Fallback:     EXPO_PUBLIC_ env vars (always available in all environments)

const getExtra = (): Record<string, string> => {
  // SDK 45+ (Expo Go uses manifest2)
  const m2 = (Constants as any).manifest2;
  if (m2?.extra?.expoClient?.extra) return m2.extra.expoClient.extra;

  // expoConfig (works in dev builds and web)
  if (Constants.expoConfig?.extra) return Constants.expoConfig.extra as Record<string, string>;

  // Legacy manifest (older SDK)
  const m1 = (Constants as any).manifest;
  if (m1?.extra) return m1.extra;

  return {};
};

const extra = getExtra();

const CLIENT_ID: string     = extra.FT_CLIENT_ID     ?? (process.env.EXPO_PUBLIC_FT_CLIENT_ID     ?? '');
const CLIENT_SECRET: string = extra.FT_CLIENT_SECRET ?? (process.env.EXPO_PUBLIC_FT_CLIENT_SECRET ?? '');

console.log('[Auth] CLIENT_ID set?', !!CLIENT_ID);
console.log('[Auth] CLIENT_SECRET set?', !!CLIENT_SECRET);

// ─── Token cache (in-memory) ────────────────────────────────────────────────

interface TokenCache {
  access_token: string;
  expires_at: number;
}

let tokenCache: TokenCache | null = null;

const TOKEN_URL = 'https://api.intra.42.fr/oauth/token';

export const getAccessToken = async (): Promise<string> => {
  if (tokenCache && Date.now() < tokenCache.expires_at - 60_000) {
    return tokenCache.access_token;
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      'Missing credentials.\n' +
      'Make sure FT_CLIENT_ID and FT_CLIENT_SECRET are set in your .env\n' +
      'and restart the Expo dev server with: npx expo start --tunnel --clear'
    );
  }

  const { data } = await axios.post(
    TOKEN_URL,
    {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    },
    { headers: { 'Content-Type': 'application/json' } }
  );

  tokenCache = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };

  console.log('[Auth] ✅ Token refreshed. Expires:', new Date(tokenCache.expires_at).toISOString());
  return tokenCache.access_token;
};