import * as core from '@actions/core';
import { type OidcLoginConfig, makeOidcLoginConfig } from './config';
import { exchangeIdToken, buildPulumiAudience } from './oauth2';
import { setOutputs, fetchOIDCToken } from './gh';

const main = async (): Promise<void> => {
  const oidcConfig = makeOidcLoginConfig();
  if (!oidcConfig.success) {
    throw new Error('Invalid input params');
  }

  const accessToken = await ensureAccessToken(oidcConfig.value);
  core.info('OIDC token exchange performed successfully.');

  setOutputs(accessToken, oidcConfig.value.exportEnvironmentVariables);
};

const ensureAccessToken = async (config: OidcLoginConfig): Promise<string> => {
  const audience = buildPulumiAudience(config.organizationName);

  core.debug(`Fetching OIDC Token for ${audience}`);
  const idToken = await fetchOIDCToken(audience);

  core.debug('Exchanging oidc token for pulumi token');
  const accessToken = await exchangeIdToken(config, audience, idToken);

  return accessToken;
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
