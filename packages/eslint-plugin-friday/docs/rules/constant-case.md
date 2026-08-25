# constant-case

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce `SCREAMING_SNAKE_CASE` for global magic-number, magic-text, bigint, and RegExp constants.

## Rationale

Module-level primitive constants are configuration values shared across a file. Naming them in `SCREAMING_SNAKE_CASE` visually separates fixed configuration from ordinary mutable bindings, and flags accidental `snake_case`.

## Examples

❌ Incorrect

```ts
const defaultCover = "/images/default.jpg";
const pageLimit = 10;
const default_theme = "dark";
const phoneRegex = /^[0-9]{10}$/;
```

✅ Correct

```ts
const DEFAULT_COVER = "/images/default.jpg";
const PAGE_LIMIT = 10;
const DEFAULT_THEME = "dark";
const PHONE_REGEX = /^[0-9]{10}$/;
```

Only global `const` declarations whose initializer is a static primitive, bigint, or RegExp are checked. Objects, arrays, functions, components, `let`/`var`, local-scope constants, and dynamic values are ignored. The rule is skipped entirely in config files such as `*.config.*` and `*.rc.*`.

## Options

This rule has no options.

## When not to use

Disable it if your project prefers `camelCase` or `PascalCase` for module constants.
