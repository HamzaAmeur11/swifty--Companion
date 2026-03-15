import { useEffect, useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { getToken } from '../services/storage';
import { exchangeCodeForToken } from '../services/auth';
import { AUTH_URL } from '../constants/api';

const clientId = process.env.EXPO_PUBLIC_CLIENT_ID;
const redirectUri = AuthSession.getRedirectUrl();

WebBrowser.maybeCompleteAuthSession();

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginInProgress, setLoginInProgress] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  async function checkAuthentication() {
    try {
      const token = await getToken();
      setIsAuthenticated(!!token);
    } finally {
      setIsLoading(false);
    }
  }

  const login = useCallback(async () => {
    if (loginInProgress || !clientId) return;
    
    try {
      setLoginInProgress(true);

      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: ['public'],
        redirectUri,
      });

      const result = await request.promptAsync(
        {
          authorizationEndpoint: AUTH_URL,
        }
      );

      if (result.type === 'success') {
        const code = result.params.code;
        if (code) {
          await exchangeCodeForToken(code);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
    } finally {
      setLoginInProgress(false);
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
  };
}
