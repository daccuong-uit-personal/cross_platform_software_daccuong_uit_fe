import { appConfig } from './app-config';

export const urlConfig = {
  auth: {
    login: `${appConfig.apiUrl}/auth/login`,
    register: `${appConfig.apiUrl}/auth/register`,
    refresh: `${appConfig.apiUrl}/auth/refresh`,
  },
  profile: {
    me: `${appConfig.apiUrl}/profiles/me`,
  },
};
