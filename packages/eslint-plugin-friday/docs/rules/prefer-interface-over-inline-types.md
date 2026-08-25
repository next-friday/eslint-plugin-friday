# prefer-interface-over-inline-types

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce a named interface for React component props instead of an inline object type annotation.

## Rationale

Inline object props on a component blur the component's public contract, cannot be reused or extended, and produce noisy IDE hover output. A named interface gives the props a single discoverable definition and keeps the component signature readable.

## Examples

❌ Incorrect

```tsx
const Component = (props: { children: ReactNode; title: string }) => (
  <div>{props.title}</div>
);
```

✅ Correct

```tsx
interface ComponentProps {
  children: ReactNode;
  title: string;
}

const Component = (props: ComponentProps) => <div>{props.title}</div>;
```

The rule targets single-parameter functions that return JSX, including inline object literals wrapped in `Readonly<...>` or appearing in a union.

## Options

This rule has no options.

## When not to use

Disable it if your components are trivial enough that inline prop types are acceptable.
