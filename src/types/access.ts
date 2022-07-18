import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type RequestAccessHanlder = (
  requestConfig: AxiosRequestConfig
) => Promise<AccessResponse>;

export interface AccessRequestOptions {
  accessToken: string;
  url: string;
}

export interface AccessResponse extends AxiosResponse {
  data: AccessResponsePayload;
}

export interface AccessResponsePayload {
  status: boolean;
  message?: string;
}
