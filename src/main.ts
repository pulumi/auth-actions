import { join } from 'path';
import * as core from '@actions/core';
import axios, { type AxiosResponse, type AxiosError } from 'axios';

import { type OidcLoginConfig, makeOidcLoginConfig } from './config';

interface PulumiOauth2Request {
  grant_type: string;
  audience: string;
  scope?: string;
  requested_token_type: string;
  subject_token_type: string;
  subject_token: string;
  expiration?: number;
}

interface PulumiOauth2Response {
  access_token: string;
}
interface PulumiOauth2ErrorResponse {
  error: string;
  error_description: string;
}

const main = async (): Promise<void> => {
  const oidcConfig = makeOidcLoginConfig();
  if (!oidcConfig.success) {
    throw new Error('Invalid input params');
  }

  const accessToken = await ensureAccessToken(oidcConfig.value);
  core.info('OIDC token exchange performed successfully.');

  core.setSecret(accessToken);
  core.setOutput('pulumi-access-token', accessToken);

  if (oidcConfig.value.exportEnvironmentVariables) {
    core.exportVariable('PULUMI_ACCESS_TOKEN', accessToken);
  }
};

const ensureAccessToken = async (config: OidcLoginConfig): Promise<string> => {
  const audience = `urn:pulumi:org:${config.organizationName}`;
  core.debug(`Fetching OIDC Token for ${audience}`);

  const idToken = await core.getIDToken(audience);

  core.debug('Exchanging oidc token for pulumi token');
  const accessToken = await exchangeIdToken(config, audience, idToken);

  return accessToken;
};

const exchangeIdToken = async (
  config: OidcLoginConfig,
  audience: string,
  subjectToken: string,
): Promise<string> => {
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
};

main()
  .then(() => {
    core.debug('Action completed');
  })
  //eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
  .catch((error) => {
    const err = error as Error;
    core.setFailed(err.message);
  });
