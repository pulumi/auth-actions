import * as core from '@actions/core';

export function setOutputs(
  accessToken: string,
  exportEnvironmentVariables: boolean,
) {
  core.setSecret(accessToken);
  core.setOutput('pulumi-access-token', accessToken);

  if (exportEnvironmentVariables) {
    core.exportVariable('PULUMI_ACCESS_TOKEN', accessToken);
  }
}
export async function fetchOIDCToken(audience: string) {
  return core.getIDToken(audience);
}
