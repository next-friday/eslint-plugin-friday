# jsx-require-suspense

💼 This rule is enabled in the ⚛️ `react/recommended` config.

<!-- end auto-generated rule header -->

Require lazy-loaded components to be rendered inside a `<Suspense>` boundary.

## Rationale

A component created with `lazy()` or `React.lazy()` suspends while its chunk loads. Without an enclosing `<Suspense>` fallback, React throws at runtime. Enforcing the boundary at lint time turns a runtime crash into a fixable warning.

## Examples

❌ Incorrect

```tsx
const AsyncComponent = lazy(() => import("./Component"));

<AsyncComponent />;
```

✅ Correct

```tsx
const AsyncComponent = lazy(() => import("./Component"));

<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>;
```

The rule tracks identifiers assigned from `lazy` / `React.lazy` and verifies each usage has a `<Suspense>` ancestor anywhere up the tree.

## Options

This rule has no options.

## When not to use

Disable it if you wrap lazy components in a custom boundary the rule cannot recognize, or if a parent route already guarantees a Suspense boundary.
