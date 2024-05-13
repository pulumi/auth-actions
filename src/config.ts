import { getInput, getBooleanInput } from '@actions/core';
import { getNumberInput } from 'actions-parsers';
import * as rt from 'runtypes';

export const oidcLoginConfig = rt.Record({
  cloudUrl: rt.String,
  organizationName: rt.String,
  requestedTokenType: rt.String,
  scope: rt.String.Or(rt.Undefined),
  expiration: rt.Number.Or(rt.Undefined),
  exportEnvironmentVariables: rt.Boolean,
});

export type OidcLoginConfig = rt.Static<typeof oidcLoginConfig>;

export function makeOidcLoginConfig(): rt.Result<OidcLoginConfig> {
  return oidcLoginConfig.validate({
    organizationName: getInput('organization', { required: true }),
    requestedTokenType: getInput('requested-token-type', { required: true }),
    scope: getInput('scope') || undefined,
    expiration: getNumberInput('token-expiration') || undefined,
    cloudUrl: getInput('cloud-url') || 'https://api.pulumi.com',
    exportEnvironmentVariables:
      getBooleanInput('export-environment-variables') || true,
  });
}
