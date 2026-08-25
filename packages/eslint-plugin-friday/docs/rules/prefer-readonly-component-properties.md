# prefer-readonly-component-properties

💼 This rule is enabled in the ⚛️ `react/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce wrapping a React component's named props type with `Readonly<>`.

## Rationale

Props are owned by the parent; a component must never mutate them. Wrapping the props type in `Readonly<>` makes that contract explicit and lets the type checker catch accidental writes.

## Examples

❌ Incorrect

```tsx
interface Props {
  children: ReactNode;
}
const Component = (props: Props) => <div>{props.children}</div>;
```

✅ Correct

```tsx
interface Props {
  children: ReactNode;
}
const Component = (props: Readonly<Props>) => <div>{props.children}</div>;
```

The rule fires only for functions that return JSX and take a single parameter typed with a named type reference. Inline object types, primitive params, multi-param functions, and types already wrapped in `Readonly<>` are left alone. The fixer adds the wrapper.

## Options

This rule has no options.

## When not to use

Disable it if you rely on a different immutability convention, or if you wrap props elsewhere in the type definition.
