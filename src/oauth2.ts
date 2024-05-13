import { join } from 'path';
import axios, { type AxiosResponse, type AxiosError } from 'axios';
import { type OidcLoginConfig } from './config';

export interface PulumiOauth2Request {
  grant_type: string;
  audience: string;
  scope?: string;
  requested_token_type: string;
  subject_token_type: string;
  subject_token: string;
  expiration?: number;
}

export interface PulumiOauth2Response {
  access_token: string;
}
export interface PulumiOauth2ErrorResponse {
  error: string;
  error_description: string;
}

export function buildPulumiAudience(organizationName: string) {
  return `urn:pulumi:org:${organizationName}`;
}

export async function exchangeIdToken(
  config: OidcLoginConfig,
  audience: string,
  subjectToken: string,
): Promise<string> {
  const url = join(config.cloudUrl, 'api', 'oauth', 'token');

  const body: PulumiOauth2Request = {
    audience,
    grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
    subject_token_type: 'urn:ietf:params:oauth:token-type:id_token',
    requested_token_type: config.requestedTokenType,
    subject_token: subjectToken,
  };

  if (config.expiration !== undefined) {
    body.expiration = config.expiration;
  }

  if (config.scope !== undefined) {
    body.scope = config.scope;
  }

  try {
    const res: AxiosResponse<PulumiOauth2Response> = await axios.post(
      url,
      body,
    );
    const oauth2Response = res.data;
    return oauth2Response.access_token;
  } catch (error) {
    const err = error as AxiosError<PulumiOauth2ErrorResponse>;
    const res = err.response;

    if (res === undefined) {
      throw error;
    }

    throw new Error(
      `Invalid response from token exchange ${res.status}: ${res.statusText} (${res.data.error}: ${res.data.error_description})`,
    );
  }
}
