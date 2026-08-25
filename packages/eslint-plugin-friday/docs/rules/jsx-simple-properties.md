# jsx-simple-properties

💼 This rule is enabled in the ⚛️ `react/recommended` config.

<!-- end auto-generated rule header -->

Enforce that JSX prop values are strings, simple variables, or ReactNode elements.

## Rationale

Complex expressions inside props such as function calls, inline objects or arrays, arithmetic, and ternaries hide computation in the markup and create new references each render. Extracting them to a named variable keeps the JSX declarative and the computation testable.

## Examples

❌ Incorrect

```tsx
<Component onClick={handleClick()} value={a + b} style={{ color: "red" }} />
```

✅ Correct

```tsx
<Component onClick={handleClick} value={total} style={style} />
```

Allowed prop expressions are identifiers, literals, member expressions, JSX elements/fragments, and arrow/function expressions. Everything else is flagged.

## Options

This rule has no options.

## When not to use

Disable it if your team prefers inline expressions in props and is not concerned with re-render churn.
