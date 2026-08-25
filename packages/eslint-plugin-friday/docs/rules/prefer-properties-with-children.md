# prefer-properties-with-children

💼 This rule is enabled in the ⚛️ `react/recommended` config.

<!-- end auto-generated rule header -->

Prefer `PropsWithChildren<T>` over manually declaring `children?: ReactNode` in component props.

## Rationale

`children?: ReactNode` is exactly what `PropsWithChildren<T>` provides. Using the helper communicates intent, stays in sync with React's own typing, and removes a line of boilerplate from every container component.

## Examples

❌ Incorrect

```tsx
interface LayoutProps {
  children?: ReactNode;
  title: string;
}
```

✅ Correct

```tsx
type LayoutProps = PropsWithChildren<{ title: string }>;
```

Only an optional `children?: ReactNode` or `React.ReactNode` member is flagged, in both interfaces and object type literals. Required `children`, render-prop `children`, and other element types are left alone.

## Options

This rule has no options.

## When not to use

Disable it if you avoid `PropsWithChildren` and prefer to spell out `children` explicitly.
