# Next Friday ESLint Plugin: Overview

## What This Repository Is

`eslint-plugin-friday` contains `@next-friday/eslint-plugin-friday`, the standalone implementation package for Next Friday-specific ESLint rules.

It exists to provide a standalone package for Next Friday-specific ESLint rules.

| Surface                                        | Owner           |
| :--------------------------------------------- | :-------------- |
| Rule implementations                           | This repository |
| Rule metadata and generated rule documentation | This repository |
| Public plugin entrypoint                       | This repository |

## Design Stance

- Keep the plugin focused on its exported rules and package API.
- Preserve exported rule names and observable behavior as stable package contracts.
- Prefer maintained upstream plugin rules when they correctly implement the invariant.
- Keep runtime dependencies limited to code required by shipped rules.
- Use standard ESLint-plugin ecosystem tooling instead of bespoke registries or documentation generators.

## Verification

`pnpm verify` covers lint, formatting, manifest ordering, generated docs, types, tests with coverage, dead-code analysis, build, Publint, and AreTheTypesWrong. For material pushes, the pre-push hook scans outgoing commits with Gitleaks and then runs `pnpm verify`.

Repository CI adds compatibility checks across supported Node.js and ESLint versions, CodeQL, Codecov patch coverage, pull-request governance, and release automation. The required PR-title check is triggered by `pull_request` so human and Changesets-generated PRs follow the same status-check path.
