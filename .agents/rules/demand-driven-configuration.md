# Demand-Driven Configuration Rules

Keep configuration demand-driven, observable, and aligned with verified requirements of the project.

## Demand-Driven Configuration

- Add or modify rules, plugins, parser options, environment flags, scripts, and workflow settings only for an active requirement in the configuration's scope.
- Prefer the smallest configuration that satisfies the current contract.
- Reuse repeated configuration values when a local abstraction makes the configuration clearer; avoid duplicating identical definitions.
- Remove configuration that has no active code path, test, or documented purpose.
- Do not add options, fallback branches, compatibility modes, or feature flags for hypothetical future needs.

## Match Patterns and Boundaries

- Make paths, file patterns, extensions, and ignore rules match actual files in the intended repository, workspace, or project boundary.
- Compose project configuration from established shared definitions and keep shared patterns in one source of truth.
- Use externally visible patterns only when they are part of a documented package contract and verified through an applicable check.
- Keep generated artifacts and external tool boundaries explicit rather than hiding them in broad patterns.

## Effective Configuration

- Remove dead settings that no active code path or supported tool in scope reads, including stale keys, unreachable branches, and values shadowed by later configuration.
- Ensure selectors, paths, and patterns match intended supported targets and do not unintentionally cross project boundaries.
- Avoid no-op values that equal the tool's effective default unless the explicit value is required by a public contract or protects against a documented default change.
- Verify configuration through the tool's validation or effective-configuration output, or through a representative command that demonstrates the setting takes effect. File presence alone does not prove a setting is active.
