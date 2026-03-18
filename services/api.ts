/**
 * services/api.ts
 */

import axios, { AxiosError } from 'axios';
import { getAccessToken } from './auth';

const BASE = 'https://api.intra.42.fr/v2';

export interface FtUser {
  id: number;
  login: string;
  email: string;
  displayname: string;
  image: {
    link: string;
    versions: { large: string; medium: string; small: string; micro: string };
  };
  wallet: number;
  correction_point: number;
  pool_month: string;
  pool_year: string;
  location: string | null;
  staff?: boolean;
  alumni?: boolean;
  campus: Array<{ id: number; name: string; country: string }>;
  cursus_users: Array<{
    cursus: { id: number; name: string; slug: string };
    grade: string | null;
    level: number;
    skills: Array<{ name: string; level: number }>;
    begin_at: string;
    end_at: string | null;
    blackholed_at: string | null;
  }>;
  projects_users: Array<{
    id: number;
    project: { id: number; name: string; slug: string };
    status: string;
    'validated?': boolean;
    final_mark: number | null;
    occurrence: number;
    cursus_ids: number[];
  }>;
  titles: Array<{ id: number; name: string }>;
  titles_users: Array<{ title_id: number; selected: boolean }>;
  achievements: Array<{
    id: number;
    name: string;
    description: string;
    tier: string;
    kind: string;
    image: string;
  }>;
}

const authAxios = async () => {
  const token = await getAccessToken();
  return axios.create({
    baseURL: BASE,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserByLogin = async (login: string): Promise<FtUser> => {
  const client = await authAxios();
  try {
    const { data } = await client.get<FtUser>(`/users/${login.toLowerCase().trim()}`);
    return data;
  } catch (err) {
    const status = (err as AxiosError).response?.status;
    if (status === 404) throw new Error('USER_NOT_FOUND');
    if (status === 401) throw new Error('UNAUTHORIZED');
    if (status === 429) throw new Error('RATE_LIMITED');
    throw new Error(`API error ${status}`);
  }
};
