# Next Friday ESLint Plugin: Architecture

## Repository Topology

```text
.
├── .changeset/                 # Release intent
├── .agents/
│   ├── adr/                    # Architecture decisions
│   └── docs/                   # Agent and repository documentation
├── .claude/rules/              # Repository invariants
├── .github/                    # CI, security, triage, preview, release
├── .husky/                     # commit-msg, pre-commit, pre-push
├── docs/
│   └── rules/                  # Generated rule documentation
├── src/
│   ├── index.ts                # Sole supported package entrypoint
│   ├── meta.ts                 # Plugin identity
│   ├── rules/                  # Public rule implementations
│   └── utils/                  # Private shared helpers
├── test/
├── eslint.config.ts
├── tsdown.config.ts
└── vitest.config.ts
```

## Public Boundary

`src/index.ts` exports one ESLint plugin object. Public rule names are the keys of the explicit `rules` object.

No internal rule module, helper, test utility, or generated artifact is a supported package entrypoint.

## Package Boundary

This architecture describes `@next-friday/eslint-plugin-friday` and the verified upstream dependencies used by the package.

The rationale and consequences of this boundary are recorded in [ADR 0001](../adr/0001-standalone-eslint-plugin-boundary.md).

## Rule Structure

Public rules live directly under `src/rules/`. Shared implementation used by more than one rule may live under `src/utils/`.

The package does not auto-discover rule files. Adding a public rule requires an explicit export-map change in `src/index.ts`, tests, metadata, generated docs, and an appropriate changeset.

## Documentation

Each public rule owns `meta.docs.description`, `meta.docs.url`, option schema, messages, and fixability metadata.

`eslint-doc-generator` derives:

- the README rule table,
- rule-page headers,
- option tables,
- fixable indicators.

Rule-specific behavior sections outside generator-owned markers are maintained in the corresponding rule page and describe observable behavior from the implementation and contract tests. Generated documentation is checked in CI with `pnpm docs:check`.

## Build and Distribution

`tsdown` builds ESM and declaration output into `dist/`. The package `files` list limits the future npm publication to generated distribution files.

Publint validates package metadata and packed files. AreTheTypesWrong validates type-resolution behavior.

## Repository Verification

Local hooks mirror repository policy:

- `commit-msg` → Commitlint
- `pre-commit` → lint-staged
- `pre-push` → require pushed refs to match the checked-out commit, scan outgoing commits with Gitleaks, then run `pnpm verify`.

PR title validation runs on `pull_request` rather than `pull_request_target` so Changesets version PRs created with `GITHUB_TOKEN` still produce the required `Validate pull request title` check.

CI is change-aware: normal code/configuration pull requests run the full verification jobs, while Changesets version pull requests run the narrower Release Integrity path. CodeQL remains merge-protecting; Zizmor is advisory for GitHub workflow changes. The release workflow runs `pnpm verify` again on the publish commit before packing and publishing.
