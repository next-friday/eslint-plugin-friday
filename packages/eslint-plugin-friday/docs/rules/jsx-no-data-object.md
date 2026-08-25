# jsx-no-data-object

💼 This rule is enabled in the ⚛️ `react/recommended` config.

<!-- end auto-generated rule header -->

Disallow top-level nested object literals in component files named `*.tsx` or `*.jsx`.

## Rationale

A top-level object literal with nested objects or arrays is a data structure, not UI. Like `jsx-no-data-array`, this keeps component files focused on rendering by pushing structured data into a sibling data module.

## Examples

❌ Incorrect

```tsx
// Component.tsx
const config = { home: { url: "/" } };
```

✅ Correct

```tsx
// Component.tsx
import { config } from "./component.data";

const TIMEOUT_MS = 1000;
```

The rule unwraps `as const` and `satisfies` assertions, and checks both plain and exported top-level declarations. Flat objects of primitives are left alone; only objects with a nested object or array value are flagged.

## Options

This rule has no options.

## When not to use

Disable it if you intentionally keep small structured constants inside component files.
