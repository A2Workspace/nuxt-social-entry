import { resolve } from 'path';
import { NuxtConfig } from '@nuxt/types';

export default <NuxtConfig>{
  ssr: false,
  target: 'static',
  publicRuntimeConfig: {
    isDev: process.env.NODE_ENV !== 'production',
  },
  devServerHandlers: [], // To fix Tailwindcss problems, See: https://github.com/nuxt-community/tailwindcss-module/issues/480#issuecomment-1138276828
  serverMiddleware: [
    //...
  ],
  build: {
    extractCSS: true,
  },
  buildModules: ['@nuxt/typescript-build'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '../src/module',
    // ...
  ],
  components: true,
  axios: {
    proxy: true,
  },
  proxy: {
    '/_proxy': {
      target: process.env.API_URL || 'http://localhost:8000',
      pathRewrite: {
        '^/_proxy/': '/',
      },
    },
  },
  auth: {
    watchLoggedIn: false,
    strategies: {
      laravel: {
        provider: 'laravel/jwt',
        url: '/_proxy',
        user: {
          property: 'data',
        },
      },
    },
    redirect: {
      home: '/',
    },
  },
  socialEntry: {
    endpoints: {
      authorization:
        process.env.SOCIAL_ENTRY || 'http://localhost:8000/auth/socialite',
      token: '/_proxy/auth/socialite/token',
      login: '/_proxy/auth/socialite/login',
      connect: '/_proxy/auth/socialite/connect',
    },
  },
};
