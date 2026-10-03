# Next Friday ESLint Plugin Vocabulary

Shared vocabulary for the standalone `@next-friday/eslint-plugin-friday` package.

## Language

**Plugin**

The public ESLint plugin object that exposes Next Friday-specific custom rule implementations.

**Rule ID**

An ESLint rule identifier combines the configured plugin key with an exported rule name, such as `friday/no-lazy-identifiers` in this repository's examples.

**Rule contract**

The observable combination of rule ID, accepted options, diagnostics, autofix behavior, and supported syntax.
