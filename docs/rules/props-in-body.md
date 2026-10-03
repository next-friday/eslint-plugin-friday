# props-in-body

📝 Disallow object destructuring in the first parameter of React function components.

<!-- end auto-generated rule header -->

## Behavior

This rule keeps object destructuring out of a React function component's parameter list. It reports object destructuring in the first parameter, including when that parameter has a default value.

## Examples

### Reported

Destructuring props in the signature is reported:

```tsx
export function Button({label}: {label: string}) {
  return <button>{label}</button>;
}
```

### Accepted

Accept props as a named parameter and destructure inside the component body:

```tsx
export function Button(props: {label: string}) {
  const {label} = props;

  return <button>{label}</button>;
}
```

Destructuring in the body is optional. Reading through the parameter directly is also accepted:

```tsx
export function Button(props: {label: string}) {
  return <button>{props.label}</button>;
}
```

## Scope and limitations

The rule checks the first parameter of components recognized by `@eslint-react/core`. Detected forms include function declarations, function expressions, arrow functions, and arrows passed to React's `memo` or `forwardRef`. Detection also considers function context and implementation signals such as JSX returns or Hook calls; other edge cases follow `@eslint-react/core`'s classification. It does not report array destructuring or destructuring in callbacks and other function parameters. The rule has no options or autofix.
