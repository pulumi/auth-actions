# Pulumi GitHub Auth Actions

Pulumi's GitHub Auth Actions automatically generates and exchanges GitHub's 
OpenID Connect tokens by Pulumi Access Tokens, making them available for 
your workflows removing the need of hardcoding credentials on your repos.

- [Documentation](https://www.pulumi.com/docs/pulumi-cloud/oidc/client/)

## Getting Started

```yaml
name: Pulumi
on:
  push:
    branches:
      - master
jobs:
  up:
    name: Preview
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pulumi/auth-actions@v1
        with:
          organization: contoso
          requested-token-type: urn:pulumi:token-type:access_token:organization
      - uses: pulumi/actions@v5
        with:
          command: preview
          stack-name: org-name/stack-name
```

This will check out the existing directory, then fetch a Pulumi access token
for the `contoso` organization and run `pulumi preview`.

## Configuration

The action can be configured with the following arguments:

- `organization` - The organization it will be exchanging tokens for.

- `requested-token-type` - The type of token it will request, one of:
    - urn:pulumi:token-type:access_token:organization
    - urn:pulumi:token-type:access_token:team
    - urn:pulumi:token-type:access_token:personal

- `scope` (optional) - The scope to use when requesting the Pulumi access token, 
    according to the token type:
    - For personal access tokens: `user:USER_NAME`
    - For team access tokens: `team:TEAM_NAME`
    - For organization access tokens, no scope is required

- `token-expiration` (optional) - The token expiration in seconds requested. It 
    is up to the Pulumi authorization server to grant or reduce it.

- `export-environment-variables` (optional) - By default the action will export
    the `PULUMI_ACCESS_TOKEN` environment variable. If `false`, it will only return 
    the token through the action's outputs.


- `cloud-url` (optional) - By default the action will try to authenticate Pulumi with 
[Pulumi Cloud](https://app.pulumi.com/). If you need to specify an alternative backend, 
you can do it via this argument.
