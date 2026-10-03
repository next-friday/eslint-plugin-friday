# Changesets

Use a changeset for every publishable rule or package API change with external impact. Do not add a changeset for changes that do not affect a package release.

The current package baseline is `0.0.0`. `.changeset/first-release.md` is the pending First Release; do not create a second initial-release changeset.

## Add a changeset

From the repository root:

```sh
pnpm changeset
```

Check pending `.changeset/*.md` files first. Do not record the same unreleased change twice.

## Choose a release type

- Use `patch` for backward-compatible fixes.
- Use `minor` for new backward-compatible rules or capabilities.
- Use `major` for breaking rule behavior, removed or renamed rule IDs, or incompatible package API changes.

## Write release notes

Write each entry so it stands on its own:

- Name the affected rule or package behavior directly.
- Include rule IDs, options, diagnostics, or autofix behavior when they matter.
- Include migration guidance for breaking changes.
- Do not rely on an issue, pull request, or commit link to explain the change.
