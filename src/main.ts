import * as rt from 'runtypes';
import * as core from '@actions/core';
import { getNumberInput } from 'actions-parsers';
import {
  type OidcLoginConfig,
  OidcLoginConfigRuntype,
  ensureAccessToken,
} from '@pulumi/actions-helpers/auth';

function makeOidcLoginConfig(): rt.Result<OidcLoginConfig> {
  return OidcLoginConfigRuntype.validate({
    organizationName: core.getInput('organization', { required: true }),
    requestedTokenType: core.getInput('requested-token-type', {
      required: true,
    }),
    scope: core.getInput('scope') || undefined,
    expiration: getNumberInput('token-expiration') || undefined,
    cloudUrl: core.getInput('cloud-url') || 'https://api.pulumi.com',
    exportEnvironmentVariables:
      core.getBooleanInput('export-environment-variables') || true,
  });
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

main()
  .then(() => {
    core.debug('Action completed');
  })
  //eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
  .catch((error) => {
    const err = error as Error;
    core.setFailed(err.message);
  });
