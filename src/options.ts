export interface ModuleOptions {
  url?: string;
  endpoints: ModuleOptionsEndpoints;
}

export interface ModuleOptionsEndpoints {
  authorization?: string;
  token?: string;
  login?: string;
  connect?: string;
  disconnect?: string;
}

export const moduleDefaults: ModuleOptions = {
  url: '',
  endpoints: {
    authorization: 'http://localhost:8000/auth/socialite',
    token: '/auth/socialite/token',
    login: '/auth/socialite/login',
    connect: '/auth/socialite/connect',
    disconnect: '/auth/socialite/disconnect',
  },
};
