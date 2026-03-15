import { useQuery } from '@tanstack/react-query';
import { getUser } from '../services/api42';
import { User, UserError } from '../types';

export function useUser(login: string) {
  return useQuery<User, UserError>({
    queryKey: ['user', login],
    queryFn: () => getUser(login),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!login,
  });
}
