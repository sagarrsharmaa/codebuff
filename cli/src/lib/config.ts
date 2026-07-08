import Conf from 'conf';

interface CliConfig {
  accessToken?: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
  lastLogin?: string; // ISO date
  apiBaseUrl: string;
}

const config = new Conf<CliConfig>({
  projectName: 'codebuff',
  cwd: undefined, // uses OS config dir: ~/.codebuff/
  defaults: {
    apiBaseUrl: 'http://localhost:3000',
  },
});

export function getConfig(): CliConfig {
  return config.store;
}

export function setAccessToken(token: string, user: CliConfig['user']) {
  config.set('accessToken', token);
  config.set('user', user);
  config.set('lastLogin', new Date().toISOString());
}

export function clearAuth() {
  config.delete('accessToken');
  config.delete('user');
  config.delete('lastLogin');
}

export function isAuthenticated(): boolean {
  return !!config.get('accessToken');
}

export function getApiBaseUrl(): string {
  return config.get('apiBaseUrl') || 'http://localhost:3000';
}

export function getAuthHeaders(): Record<string, string> {
  const token = config.get('accessToken');
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export default config;
