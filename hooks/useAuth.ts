import { useEffect, useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session';
import { exchangeCodeForToken, getValidToken, logout } from '../services/auth';
import { AUTH_URL, TOKEN_URL, CLIENT_ID, REDIRECT_URI } from '../constants/api';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: AUTH_URL,
  tokenEndpoint: TOKEN_URL,
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ['public'],
      usePKCE: false,
    },
    discovery
  );

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (response?.type === 'success' && response.params.code) {
      handleCode(response.params.code);
    }
  }, [response]);

  async function checkAuth() {
    setIsLoading(true);
    const token = await getValidToken();
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }

  async function handleCode(code: string) {
    setIsLoading(true);
    try {
      await exchangeCodeForToken(code);
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = useCallback(() => {
    promptAsync();
  }, [promptAsync]);

  const signOut = useCallback(async () => {
    await logout();
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, isLoading, signIn, signOut, request };
}