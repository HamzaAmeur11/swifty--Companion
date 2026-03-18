export interface Token {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  percentage: number;
}

export interface Project {
  id: number;
  name: string;
  final_mark: number | null;
  passed: boolean;
  status: string;
}

export interface User {
  id: number;
  login: string;
  email: string;
  phone: string;
  displayname: string;
  image: { link: string };
  wallet: number;
  correction_point: number;
  location: string | null;
  cursus_users: Array<{
    level: number;
    skills: Skill[];
    cursus: { name: string };
  }>;
  projects_users: Array<{
    project: { name: string; id: number };
    final_mark: number | null;
    passed: boolean | null;
    status: string;
  }>;
}
