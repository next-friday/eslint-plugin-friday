# sort-exports

💼 This rule is enabled in the ✅ `base/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce a consistent ordering of export groups.

## Rationale

Ordering re-exports by origin makes a barrel file's surface predictable: external and alias re-exports first, then relative re-exports, then local exports. Consistent ordering reduces merge noise and makes the public surface easy to scan.

## Examples

❌ Incorrect

```ts
export { bar };
export { foo } from "react";
```

✅ Correct

```ts
export { foo } from "react";
export { bar };
```

Exports are ordered by group: external/alias re-exports, relative re-exports, then local exports. Only named exports participate; `export *`, `export default`, and exports with declarations reset the run, so each contiguous block is checked independently. The fixer reorders the exports within each run. When the run contains a comment, the autofix is skipped so a reorder never strands the comment; the rule still reports.

## Options

This rule has no options.

## When not to use

Disable it if you prefer a different export ordering convention.
