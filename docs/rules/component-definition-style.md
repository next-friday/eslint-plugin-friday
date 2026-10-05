# component-definition-style

📝 Require named React function components to use function declarations.

<!-- end auto-generated rule header -->

## Behavior

This rule uses the same React function-component detection as the other Friday React rules and reports named component bindings implemented as arrow functions or function expressions.

The canonical form is:

```tsx
function Button(props: ButtonProps) {
  return <button>{props.children}</button>;
}
```

The rule does not constrain ordinary callbacks, utilities, custom Hooks, or anonymous default exports that have no module binding to standardize.

## Examples

### Reported

```tsx
export const Button = (props: ButtonProps) => <button>{props.children}</button>;
```

### Accepted

```tsx
export function Button(props: ButtonProps) {
  return <button>{props.children}</button>;
}
```
