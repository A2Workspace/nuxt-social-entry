import { Context } from '@nuxt/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ModuleOptions {
    url?: string;
    endpoints: ModuleOptionsEndpoints;
}
interface ModuleOptionsEndpoints {
    authorization?: string;
    token?: string;
    login?: string;
    connect?: string;
    disconnect?: string;
}
declare const moduleDefaults: ModuleOptions;

declare type RequestAccessHanlder = (requestConfig: AxiosRequestConfig) => Promise<AccessResponse>;
interface AccessRequestOptions {
    accessToken: string;
    url: string;
}
interface AccessResponse extends AxiosResponse {
    data: AccessResponsePayload;
}
interface AccessResponsePayload {
    status: boolean;
    message?: string;
}

interface CompleteAuthorizationRequestOptions {
    code?: string;
    url?: string;
    autoResetParams?: boolean;
}
interface AccessTokenResponse extends AxiosResponse {
    data: AccessTokenResponsePayload;
}
interface AccessTokenResponsePayload {
    provider: string;
    identifier: string;
    social_email?: string;
    social_name?: string;
    social_avatar?: string;
    scopes?: string;
    access_token: string;
    expire_time: number;
    new_user: boolean;
    local_user_id?: string;
}

declare type HTTPRequest = AxiosRequestConfig;
declare type HTTPResponse = AxiosResponse;

declare class RedirectRequest {
    private targetUrl;
    static make: Function;
    constructor(targetUrl: string);
    redirect(): void;
    getTargetUrl(): string;
}

declare class SocialEntry {
    ctx: Context;
    options: ModuleOptions;
    private accessToken?;
    private lastAccessTokenResponse?;
    constructor(ctx: Context, options: ModuleOptions);
    endpoint(name: string): string;
    /**
     * 將使用者導向到第三方社群登入頁面
     */
    authorize(provider: string, continueUri?: string): RedirectRequest;
    /**
     * 完成授權並取回使用者資訊與 access_token
     */
    completeAuthorization(code?: string | CompleteAuthorizationRequestOptions): Promise<AccessTokenResponse>;
    /**
     * 判斷當前網址是否帶有 code 參數
     */
    hasAuthCode(): boolean;
    /**
     * 判斷授權的使用者資料是否為新使用者
     */
    isNewUserAccess(response: AccessTokenResponse | AxiosResponse): boolean;
    /**
     * 判斷 Response 是否包含 access_token
     */
    hasAccessToken(response: AccessTokenResponse | AxiosResponse): boolean;
    /**
     * 解析 Response 並回傳 access_token
     */
    getAccessToken(response: AccessTokenResponse | AxiosResponse): string;
    requestAccess(options: AccessRequestOptions, handler: RequestAccessHanlder): Promise<AccessResponse>;
    loginWithToken(accessToken: string | AccessRequestOptions): Promise<AccessResponse>;
    connectWithToken(accessToken: string | AccessRequestOptions): Promise<AccessResponse>;
    disconnect(provider: string, identifier: string): any;
}

declare function getParam(key: string): string;
declare function resetParams(): void;
declare function getPayload(response: AxiosResponse): any;

export { AccessRequestOptions, AccessResponse, AccessResponsePayload, AccessTokenResponse, AccessTokenResponsePayload, CompleteAuthorizationRequestOptions, HTTPRequest, HTTPResponse, ModuleOptions, ModuleOptionsEndpoints, RequestAccessHanlder, SocialEntry, getParam, getPayload, moduleDefaults, resetParams };
