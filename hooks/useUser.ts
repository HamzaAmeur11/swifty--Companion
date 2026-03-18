import { useQuery } from '@tanstack/react-query';
import { getUser } from '../services/api42';
import { User } from '../types';

export function useUser(login: string) {
  return useQuery<User, Error>({
    queryKey: ['user', login],
    queryFn: () => getUser(login),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!login,
  });
}
