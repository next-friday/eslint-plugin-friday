# jsx-no-data-array

💼 This rule is enabled in the ⚛️ `react/recommended` config.

<!-- end auto-generated rule header -->

Disallow top-level arrays of object literals in component files named `*.tsx` or `*.jsx`.

## Rationale

Component files should describe UI, not carry static datasets. A top-level array of object literals is data, and data belongs in a sibling module such as `*.data.ts`, where it can be typed, tested, and reused without dragging the component along.

## Examples

❌ Incorrect

```tsx
// Component.tsx
const stores = [{ name: "Koh Samui" }, { name: "Phuket" }];
```

✅ Correct

```tsx
// Component.tsx
import { stores } from "./component.data";
```

The rule unwraps `as const` and `satisfies` assertions, and checks both plain and exported top-level declarations. Arrays of primitives are left alone.

## Options

This rule has no options.

## When not to use

Disable it if you intentionally co-locate small static datasets inside component files.
