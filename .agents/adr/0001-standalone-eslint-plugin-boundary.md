# Keep custom rule implementation in a standalone plugin

## Context

The package provides Next Friday-specific ESLint rule implementations. Its architecture describes the package contracts and verified upstream dependencies used by this repository.

## Decision

Keep rule implementation, metadata, schemas, diagnostics, fixes, documentation, and the public plugin entrypoint in `@next-friday/eslint-plugin-friday`.

## Consequences

- The package has an explicit standalone boundary.
- Exported rule names and observable behavior are package contracts.
- The plugin exposes its supported rule surface through its explicit entrypoint.
