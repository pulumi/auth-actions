# CHANGELOG

## HEAD (Unreleased)

- chore: Remove the immutable-action publish workflow in favor of GitHub's
  GA Immutable Releases setting
  ([#61](https://github.com/pulumi/auth-actions/pull/61))

---

## 2.1.0 (2026-05-29)

- fix: Build with rollup instead of ncc to fix a load crash (`require is not
  defined in ES module scope`) that broke v2.0.0 for all consumers
  ([#63](https://github.com/pulumi/auth-actions/pull/63))

---

## 2.0.0 (2026-05-29)

- feat: Update action runtime to Node 24 (**breaking change**)
  ([#59](https://github.com/pulumi/auth-actions/pull/59))
- chore: Use `@pulumi/actions-helpers`
  ([#54](https://github.com/pulumi/auth-actions/pull/54))
- docs: Remove mention of old admin scope for org tokens on OIDC
  ([#56](https://github.com/pulumi/auth-actions/pull/56))
- fix: oauth url on windows
  ([#53](https://github.com/pulumi/auth-actions/pull/53))

---

## 1.0.0 (2024-05-13)

- feat: Add support for OIDC token exchange for authentication
  ([#1155](https://github.com/pulumi/actions/pull/1155))