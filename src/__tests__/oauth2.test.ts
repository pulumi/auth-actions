import * as nock from 'nock';
import { buildPulumiAudience, exchangeIdToken } from '../oauth2';
import { type OidcLoginConfig } from '../config';

describe('oauth2.ts', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('buildPulumiAudience', () => {
    it('should generate the pulumi audience', () => {
      expect(buildPulumiAudience('orgName')).toBe('urn:pulumi:org:orgName');
    });
  });

  describe('exchangeIdToken', () => {
    const cloudUrl = 'https://api.pulumi.com';
    const audience = 'urn:pulumi:org:orgName';
    const subject_token = 'the_token';
    const requested_token_type =
      'urn:pulumi:token-type:access_token:organization';

    it('should invoke the token exchange endpoint with the right params', async () => {
        const reqScope = nock(cloudUrl)
          .post('/api/oauth/token', {
            audience,
            subject_token,
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            subject_token_type: 'urn:ietf:params:oauth:token-type:id_token',
            requested_token_type,
          })
          .reply(200, { access_token: "the_access_token"});
  
        const config = {
          cloudUrl,
          requestedTokenType: requested_token_type,
        } as Partial<OidcLoginConfig>;
  
        const resToken = await exchangeIdToken(config as OidcLoginConfig, audience, subject_token);
        expect(resToken).toBe("the_access_token")

        reqScope.done();
      });

      it('should forward expiration and scope if set', async () => {
        const requested_token_type =
          'urn:pulumi:token-type:access_token:personal';
        const scope = 'USER:the_user';
        const expiration = 3600;
  
        const reqScope = nock(cloudUrl)
          .post('/api/oauth/token', {
            audience,
            subject_token,
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            subject_token_type: 'urn:ietf:params:oauth:token-type:id_token',
            requested_token_type,
            scope,
            expiration
          })
          .reply(200, {access_token: "the_access_token"});
  
        const config = {
          cloudUrl,
          requestedTokenType: requested_token_type,
          scope,
          expiration, 
        } as Partial<OidcLoginConfig>;
  
        const resToken = await exchangeIdToken(config as OidcLoginConfig, audience, subject_token);
        expect(resToken).toBe("the_access_token")
  
        reqScope.done();
      });
  });
});
