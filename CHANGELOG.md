# @next-friday/eslint-plugin-friday

## 1.1.2

### Patch Changes

- 5a51fb4: Stop `friday/component-entrypoint` from requiring same-name `ComponentProps` type aliases. The rule now validates only canonical component compound assembly while retaining `ignoreMembers` as a no-op compatibility option.

## 1.1.1

### Patch Changes

- d2b1dcb: Allow `friday/index-export-only` to accept matching public export aliases for local `*Compound` assemblies built from imported runtime bindings.

## 1.1.0

### Minor Changes

- 16f2a76: Add deterministic React component contracts: support compound component API assembly in `index-export-only`, add configurable props/rest naming to `props-in-body`, and add `component-definition-style` plus `component-entrypoint` rules for consistent component and public entrypoint structure.

## 1.0.1

### Patch Changes

- 769d502: Fix `component-module` false positives for TypeScript type aliases, React contexts, component `displayName` metadata, and default exports of detected local components while preserving diagnostics for unrelated module-scope runtime implementation.

## 1.0.0

### Major Changes

- 34bec4a: First Release.
