# Contributing

We :heart: PRs! If you have something you'd like to contribute, please open an
issue first. We're happy to talk with you about your pull request before you get
started.

For larger features, we'd appreciate it if you open a
[new issue](https://github.com/pulumi/auth-actions/issues/new) before investing a lot
of time so we can discuss the feature together. Please also be sure to browse
[current issues](https://github.com/pulumi/auth-actions/issues) to make sure your
issue is unique, to lighten the triage burden on our maintainers. Finally,
please limit your pull requests to contain only one feature at a time.
Separating feature work into individual pull requests helps speed up code review
and reduces the barrier to merge.

## Release Process

This section details the steps necessary to cut a new release. Suppose the
latest release is `v3.18.1`, and you wish to cut `v.3.19.0`.

1. Checkout the default branch.

   ```bash
   $ git checkout main
   ```

2. Open up `CHANGELOG.md`. Create a new h2 with the release version and the date
   of the release. Move the release notes from the `HEAD` section under the new
   heading, and add a note in the `HEAD` section indicating that it is currently
   empty.

   ```markdown
   # CHANGELOG

   ## HEAD (Unreleased)

   **(none)**

   ---

   ## 3.19.0 (2022-07-01)

   - feature: Add foobar support
   - bug: Fix XYZ

   ## 3.18.1 (2022-07-10)

   ...
   ```

3. Set the package version and rebuild `dist/`.

   ```bash
   $ npm version 3.19.0 --no-git-tag-version && npm run build
   ```

4. Commit your changes, and open a PR. Once your changes have been approved and
   status checks have passed, merge your PR into the default branch, `main`.

5. Wait for status checks on the default branch to pass.

6. Navigate to the
   [Release page](https://github.com/pulumi/auth-actions/releases) and draft a
   new release:

   - Make sure `Publish this Action to GitHub Marketplace` is checked (it should
     be checked by default).
   - Under the `Choose a tag` dropdown, enter in the name of your new tag,
     `v3.19.0`.
   - Under `Release Title`, enter the name of your release, `v3.19.0`.
   - Press the button `Generate release notes`. Replace the section
     `What's Changed` with the changes you added to `CHANGELOG.md`.

7. Check the tag, then press the `Publish release` button. This repository uses
   immutable releases, so you cannot change the tag of a published release.

8. Make sure the major version tag (`v3`) points to the new release. The
   `tag.yaml` workflow moves it when the release is published.
