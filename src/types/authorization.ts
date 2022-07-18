import { AxiosResponse } from 'axios';

export interface CompleteAuthorizationRequestOptions {
  code?: string;
  url?: string;
  autoResetParams?: boolean;
}

export interface AccessTokenResponse extends AxiosResponse {
  data: AccessTokenResponsePayload;
}

export interface AccessTokenResponsePayload {
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
