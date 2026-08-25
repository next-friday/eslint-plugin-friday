# properties-suffix

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce a `Props` suffix for interfaces and object-literal type aliases in component files named `*.tsx` or `*.jsx`.

## Rationale

In component files, the dominant type is the component's props. A consistent `Props` suffix such as `ButtonProps` or `CardProps` makes the props type instantly recognizable and avoids collisions with domain types of the same base name.

## Examples

❌ Incorrect

```tsx
// Button.tsx
interface Button {}
type ButtonType = { disabled: boolean };
```

✅ Correct

```tsx
// Button.tsx
interface ButtonProps {}
type CardProps = { title: string };
```

The rule runs only in `.tsx` / `.jsx` files. Interfaces are always checked; type aliases are checked only when they alias an object literal, so union, reference, and function-type aliases are left alone.

## Options

This rule accepts one options object with a single property:

- `allow`: an array of interface or type names exempt from the `Props`-suffix requirement, for genuine non-prop types in a component file. Defaults to `[]`.

## When not to use

Disable it if your components keep props types in separate non-`.tsx` files, or if you use a different suffix convention.
