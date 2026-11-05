# Contributing

We :heart: PRs! If you have something you'd like to contribute, please open an
issue first. We're happy to talk with you about your pull request before you get
started.

For larger features, we'd appreciate it if you open a
[new issue](https://github.com/pulumi/auth-actions/issues/new) before investing
a lot of time so we can discuss the feature together. Please also be sure to
browse [current issues](https://github.com/pulumi/auth-actions/issues) to make
sure your issue is unique, to lighten the triage burden on our maintainers.
Finally, please limit your pull requests to contain only one feature at a time.
Separating feature work into individual pull requests helps speed up code review
and reduces the barrier to merge.

## Release Process

This section gives the steps to cut a new release. The examples suppose that the
latest release is `v2.1.1` and that the new release is `v2.1.2`.

1. Create a release branch from the latest `main`.

   ```bash
   git switch main
   git pull --ff-only
   git switch -c release-v2.1.2
   ```

2. Open `CHANGELOG.md`. Add an h2 with the release version and the release date.
   Move the entries from the `HEAD` section under the new heading. Put
   `**(none)**` in the `HEAD` section.

   ```markdown
   # CHANGELOG

   ## HEAD (Unreleased)

   **(none)**

   ---

   ## 2.1.2 (2026-11-05)

   - fix: Fix XYZ

   ## 2.1.1 (2026-10-22)

   ...
   ```

3. Set the package version. This command changes `package.json` and
   `package-lock.json`.

   ```bash
   npm version 2.1.2 --no-git-tag-version
   ```

4. Commit `CHANGELOG.md`, `package.json` and `package-lock.json`, and open a PR.
   CI fails if `dist/` is not current. If CI fails for this reason, run
   `npm run build` and commit `dist/`.

5. When the PR has approval and its status checks pass, merge it into `main`.

6. Wait for the status checks on `main` to pass.

7. Go to the [Releases page](https://github.com/pulumi/auth-actions/releases)
   and select `Draft a new release`.

8. Make sure that `Publish this Action to GitHub Marketplace` is checked.

9. In the `Choose a tag` dropdown, enter the new tag, `v2.1.2`. Set the target
   to `main`.

10. In `Release title`, enter `v2.1.2`.

11. Select `Generate release notes`. Replace the `What's Changed` list with the
    entries for this release from `CHANGELOG.md`.

    > [!WARNING]
    >
    > The repository uses immutable releases. After you publish a release, you
    > cannot change its tag or its assets. Make sure that the tag and the target
    > commit are correct before you publish.

12. Select `Publish release`.

13. Make sure that the major version tag, `v2`, points to the new release
    commit. The `tag.yaml` workflow moves this tag when you publish a release.
