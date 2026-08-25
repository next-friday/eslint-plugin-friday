# jsx-spread-properties-last

💼 This rule is enabled in the ⚛️ `react/recommended` config.

<!-- end auto-generated rule header -->

Enforce that JSX spread attributes appear after all other props.

## Rationale

When a spread comes before explicit props, the explicit props silently override the spread, which is easy to misread. Placing spreads last makes the precedence obvious: the spread fills in defaults, explicit props win.

## Examples

❌ Incorrect

```tsx
<Component {...props} title="hello" />
```

✅ Correct

```tsx
<Component title="hello" {...props} />
```

Every spread attribute positioned before the last non-spread prop is flagged. Consecutive spreads and spreads at the end are allowed.

## Options

This rule has no options.

## When not to use

Disable it if you intentionally use leading spreads to provide overridable defaults and your team understands the precedence.
