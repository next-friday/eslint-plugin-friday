# named-props

📝 Disallow inline intersections in the first parameter of React function components.

<!-- end auto-generated rule header -->

## Behavior

This rule requires a React function component's first parameter to refer to one named props contract when its type combines multiple contracts. It reports a direct intersection annotation such as `BaseProps & VariantProps`.

## Examples

### Reported

The intersection is written directly in the component signature:

```tsx
interface BaseProps {
  disabled?: boolean;
}

interface VariantProps {
  size?: "small" | "large";
}

export function Button(props: BaseProps & VariantProps) {
  return <button disabled={props.disabled} data-size={props.size} />;
}
```

### Accepted

Give the combined component contract a name, for example with an interface that extends both contracts:

```tsx
interface BaseProps {
  disabled?: boolean;
}

interface VariantProps {
  size?: "small" | "large";
}

interface ButtonProps extends BaseProps, VariantProps {}

export function Button(props: ButtonProps) {
  return <button disabled={props.disabled} data-size={props.size} />;
}
```

## Scope and limitations

The rule checks the first parameter of components recognized by `@eslint-react/core`. Detected forms include function declarations, function expressions, arrow functions, and arrows passed to React's `memo` or `forwardRef`. Detection also considers function context and implementation signals such as JSX returns or Hook calls; other edge cases follow `@eslint-react/core`'s classification. A named type alias is accepted as well as a named interface; the rule checks the parameter syntax and does not resolve aliases. A default-valued first parameter is checked using the type annotation on its left side.

The rule does not report inline object types, intersections on non-component functions, or intersections used only for a later parameter such as a `forwardRef` ref parameter. It has no options or autofix.
