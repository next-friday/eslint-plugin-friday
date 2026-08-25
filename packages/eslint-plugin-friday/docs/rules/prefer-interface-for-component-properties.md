# prefer-interface-for-component-properties

💼 This rule is enabled in the ⚛️ `react/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce `interface` over a `type` alias for component prop declarations in component files named `*.tsx` or `*.jsx`.

## Rationale

For object-shaped props, `interface` reads better, supports declaration merging and `extends`, and produces clearer type errors. Reserving `type` aliases for unions, intersections, and references keeps the intent of each declaration obvious.

## Examples

❌ Incorrect

```tsx
// Comp.tsx
type FooProps = { x: number };
```

✅ Correct

```tsx
// Comp.tsx
interface FooProps {
  x: number;
}
```

The rule fires only for `Props`-suffixed type aliases whose value is an object type literal in a component file. Union, intersection, and reference aliases are left alone. The fixer rewrites the alias as an interface, preserving any generic parameters.

## Options

This rule has no options.

## When not to use

Disable it if your team standardizes on `type` aliases for all declarations.
