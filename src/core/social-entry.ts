import trim from 'lodash.trim';
import type { Context } from '@nuxt/types';
import type { ModuleOptions } from '../options';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  AccessTokenResponse,
  AccessTokenResponsePayload,
  AccessRequestOptions,
  AccessResponse,
  CompleteAuthorizationRequestOptions,
  RequestAccessHanlder,
} from '../types';
import RedirectRequest from './redirect-request';
import { getParam, getPayload, resetParams } from './utils';

export class SocialEntry {
  public ctx: Context;
  public options: ModuleOptions;
  private accessToken?: string;
  private lastAccessTokenResponse?: AccessTokenResponse;

  constructor(ctx: Context, options: ModuleOptions) {
    this.ctx = ctx;
    this.options = options;
  }

  endpoint(name: string): string {
    const options = Object.assign({}, this.options, this.ctx.$config);

    if (typeof options.endpoints[name] === 'undefined') {
      throw new Error(`Cannot resolve endpoint: ${name}`);
    }

    let url = options.endpoints[name];

    if (url.match(/^https?:\/\//)) {
      return url;
    }

    return trim(options.url, '/') + '/' + trim(url, '/');
  }

  // ===========================================================================
  // = Authorize
  // ===========================================================================

  /**
   * 將使用者導向到第三方社群登入頁面
   */
  authorize(provider: string, continueUri?: string): RedirectRequest {
    continueUri = continueUri || window.location.href;

    const endpoint = this.endpoint('authorization');

    return RedirectRequest.make(endpoint, {
      continue: continueUri,
      provider,
    });
  }

  // ===========================================================================
  // = CompleteAuthorization
  // ===========================================================================

  /**
   * 完成授權並取回使用者資訊與 access_token
   */
  async completeAuthorization(
    code?: string | CompleteAuthorizationRequestOptions
  ): Promise<AccessTokenResponse> {
    // The default options.
    const defaultOptions = {
      code: getParam('code'),
      url: this.endpoint('token'),
      autoResetParams: true,
    };

    // Resolve and merge options.
    const options = (function () {
      if (typeof code === 'string') {
        return Object.assign({}, defaultOptions, {
          code,
          autoResetParams: false,
        });
      }

      if (typeof code === 'object') {
        return Object.assign({}, defaultOptions, code);
      }

      return defaultOptions;
    })();

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: options.url,
      data: {
        code: options.code,
      },
    };

    const response = await this.ctx.app.$axios
      .request(requestConfig)
      .finally(() => {
        // Reset current url parmas.
        if (options.autoResetParams) {
          resetParams();
        }
      });

    this.lastAccessTokenResponse = response;
    this.accessToken = this.getAccessToken(response);

    return response;
  }

  /**
   * 判斷當前網址是否帶有 code 參數
   */
  hasAuthCode(): boolean {
    return getParam('code') !== null;
  }

  /**
   * 判斷授權的使用者資料是否為新使用者
   */
  isNewUserAccess(response: AccessTokenResponse | AxiosResponse): boolean {
    const payload: AccessTokenResponsePayload = getPayload(response);

    return payload.new_user || payload.local_user_id == null;
  }

  /**
   * 判斷 Response 是否包含 access_token
   */
  hasAccessToken(response: AccessTokenResponse | AxiosResponse): boolean {
    const payload = getPayload(response);

    return typeof payload.access_token === 'string';
  }

  /**
   * 解析 Response 並回傳 access_token
   */
  getAccessToken(response: AccessTokenResponse | AxiosResponse): string {
    const payload = getPayload(response);

    return payload.access_token;
  }

  // ===========================================================================
  // = LoginWithToken
  // ===========================================================================

  async requestAccess(
    options: AccessRequestOptions,
    handler: RequestAccessHanlder
  ): Promise<AccessResponse> {
    let accessToken = options.accessToken || this.accessToken;

    // 若 options 未 accessToken 的情形，
    // 嘗試取得 auth_code 完成授權請求，並取回 access_token
    if (!accessToken) {
      if (this.hasAuthCode() == false) {
        throw new Error('[SocialEntry] Unauthorized');
      }

      const accessTokenResponse = await this.completeAuthorization();

      let respondedAccessToken = this.getAccessToken(accessTokenResponse);
      if (!respondedAccessToken) {
        throw new Error('[SocialEntry] Invalid access token response');
      }

      accessToken = respondedAccessToken;
    }

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: options.url,
      data: {
        access_token: accessToken,
      },
    };

    return await handler(requestConfig);
  }

  async loginWithToken(
    accessToken: string | AccessRequestOptions
  ): Promise<AccessResponse> {
    const options = parseAccessRequestOptions(
      accessToken,
      this.endpoint('login')
    );

    const response = await this.requestAccess(options, (requestConfig) => {
      return this.ctx.app.$axios.request(requestConfig);
    });

    if (isAuthModuleLoaded(this.ctx)) {
      const userAccessToken = this.getAccessToken(response);

      await this.ctx.app.$auth.setUserToken(userAccessToken, userAccessToken);
    }

    return response;
  }

  connectWithToken(
    accessToken: string | AccessRequestOptions
  ): Promise<AccessResponse> {
    const options = parseAccessRequestOptions(
      accessToken,
      this.endpoint('connect')
    );

    return this.requestAccess(options, (requestConfig) => {
      return this.ctx.app.$axios.request(requestConfig);
    });
  }

  disconnect(provider: string, identifier: string) {
    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: this.endpoint('disconnect'),
      data: {
        identifier,
        type: provider,
      },
    };

    return this.ctx.app.$axios.request(requestConfig);
  }
}

function parseAccessRequestOptions(
  accessToken: any,
  url?: string
): AccessRequestOptions {
  // The default options.
  const defaultOptions: AccessRequestOptions = {
    accessToken: null,
    url,
  };

  // Resolve and merge options.
  const options = (function () {
    if (typeof accessToken === 'string') {
      return Object.assign({}, defaultOptions, { accessToken });
    }

    if (typeof accessToken === 'object') {
      return Object.assign({}, defaultOptions, accessToken);
    }

    return defaultOptions;
  })();

  return options;
}

function isAuthModuleLoaded(ctx: Context): boolean {
  return ctx.app.$auth && typeof ctx.app.$auth.setUserToken === 'function';
}
