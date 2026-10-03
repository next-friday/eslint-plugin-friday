# Contributing to @next-friday/eslint-plugin-friday

Use this guide to prepare changes to the Next Friday ESLint plugin.

This repository contains one ESM package: `@next-friday/eslint-plugin-friday`.

## Code of conduct

Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Prerequisites

- Use the Node.js version declared by `.nvmrc` and `package.json#engines`.
- Use the pnpm version declared by `package.json#packageManager` through Corepack.

From the repository root:

```sh
corepack enable
pnpm install
```

## Quality standards

- Fix lint, type, test, documentation, and packaging failures at their root cause.
- Preserve exported public rule names and observable behavior unless the change explicitly declares a breaking contract.
- Edit source under `src/`, tests under `test/`, and rule metadata in the owning rule module.
- Treat `dist/` as generated output.
- When rule metadata changes, run `pnpm docs:generate` and include the generated diff.
- Do not hand-edit generator-owned rule headers, option tables, fixability notices, or the README rule table.
- Keep rule behavior sections in `docs/rules/` outside generator-owned markers.

## Verification

Run the narrowest check that covers the change. Run `pnpm verify` before submitting package-wide changes.

For focused checks, use the relevant script in [`package.json`](package.json). Do not report CI-owned checks as local successes.

## Release intent

Use [`.changeset/README.md`](.changeset/README.md) to determine whether the change needs a changeset.

Renaming or removing a public rule name, or making previously accepted code report a diagnostic, is normally a breaking public-contract change.

## Pull requests

- Use `<type>(<scope>): <subject>` for commit messages and pull request titles.
- Keep each pull request focused on one cohesive change.
- Describe observable rule or package API effects.
- Report only checks that actually ran and include their results.
- Add or update tests only when they protect a distinct observable contract.
