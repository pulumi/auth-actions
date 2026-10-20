import * as core from '@actions/core';
import {
  OidcLoginConfigRuntype,
  ensureAccessToken,
} from '@pulumi/actions-helpers/auth';

function getNumberInput(name: string): number | undefined {
  const value = core.getInput(name);
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Input ${name} was not a number: ${value}`);
  }
  return parsed;
}

function makeOidcLoginConfig() {
  return OidcLoginConfigRuntype.validate({
    organizationName: core.getInput('organization', { required: true }),
    requestedTokenType: core.getInput('requested-token-type', {
      required: true,
    }),
    scope: core.getInput('scope') || undefined,
    // A token-expiration of 0 means "use the server default".
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    expiration: getNumberInput('token-expiration') || undefined,
    cloudUrl: core.getInput('cloud-url') || 'https://api.pulumi.com',
    exportEnvironmentVariables: core.getBooleanInput(
      'export-environment-variables',
    ),
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
