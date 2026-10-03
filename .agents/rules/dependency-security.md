# Dependency Security Rules

Review dependencies for supply-chain risk, maintenance, and reproducible resolution using the conventions of the project and repository.

## Selection and Ownership

- Before introducing a dependency, assess its release cadence, license, advisory history, compatibility, and transitive dependency health.
- Prefer native platform capabilities and dependencies the owning project already provides. Add a dependency only when active code, tests, build tooling, or a documented contract uses it.
- In a multi-project repository, place each dependency in the manifest of the project that imports or executes it; use shared or root manifests only when the workspace convention calls for it.
- Remove a dependency when its last import, execution path, or tooling use is removed.
- Place dependencies in the category provided by the ecosystem that matches their role, such as runtime, development, peer, or optional dependencies where supported.
- Prefer actively maintained dependencies compatible with supported upstreams; resolve warnings and verify installation scripts before adoption.

## Lockfile and Versions

- Follow the repository's versioning policy; pin exact versions when deterministic execution requires it.
- Maintain the relevant ecosystem lockfile as the authoritative resolution record when the project uses one.
- Bound compatibility ranges to supported runtimes and verified package requirements.
- Keep dependency manifests free of speculative, unused, and duplicate dependencies.

## Vulnerability Policy

- Run dependency audits when requested or required by the repository's established verification policy; do not add them as an implicit local step.
- Resolve findings from requested dependency and unused-code analysis rather than suppressing them.
