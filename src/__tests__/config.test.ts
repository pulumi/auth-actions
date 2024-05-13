import { makeOidcLoginConfig } from '../config';

function setupMockedConfig(config: Record<string, string>): void {
  Object.entries(config).forEach(([key, value]) => {
    process.env[`INPUT_${key.replace(/ /g, '_').toUpperCase()}`] = value;
  });
}

describe('config.ts', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should validate a configuration', () => {
    const config: Record<string, string> = {
      organization: 'organization-name',
      'requested-token-type': 'urn:pulumi:token-type:access_token:organization',
      'export-environment-variables': 'false',
    };

    setupMockedConfig(config);
    const c = makeOidcLoginConfig();

    expect(c).toBeTruthy();
    expect(c).toMatchInlineSnapshot(`
      {
        "success": true,
        "value": {
          "cloudUrl": "https://api.pulumi.com",
          "expiration": undefined,
          "exportEnvironmentVariables": true,
          "organizationName": "organization-name",
          "requestedTokenType": "urn:pulumi:token-type:access_token:organization",
          "scope": undefined,
        },
      }
    `);
  });
});
