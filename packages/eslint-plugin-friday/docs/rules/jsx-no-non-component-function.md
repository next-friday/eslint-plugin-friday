# jsx-no-non-component-function

💼 This rule is enabled in the ⚛️ `react/recommended` config.

<!-- end auto-generated rule header -->

Disallow non-component functions declared at the top level of component files named `*.tsx` or `*.jsx`.

## Rationale

A component file should export a component, not a grab-bag of helpers. Top-level helper functions blur that responsibility. Extract them to a separate module so the component file stays focused on rendering.

## Examples

❌ Incorrect

```tsx
// Component.tsx
const formatName = (name: string) => name.toUpperCase();

const Component = () => <div>{formatName("test")}</div>;
```

✅ Correct

```tsx
// Component.tsx
import { formatName } from "./format-name";

const Component = () => <div>{formatName("test")}</div>;
```

A function is treated as a component, and therefore allowed, when it has a PascalCase name or a `JSX` / `ReactElement` / `ReactNode` return type. Exported and imported functions are left alone.

## Options

This rule accepts one options object with a single property:

- `allow`: an array of function names exempt from this rule, such as custom hooks or helpers a team keeps local to the file. Defaults to `[]`.

## When not to use

Disable it if you intentionally co-locate small helpers with the component that uses them.
