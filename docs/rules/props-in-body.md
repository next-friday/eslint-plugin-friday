# props-in-body

📝 Require React function components to accept props through a named parameter and destructure them inside the body.

<!-- end auto-generated rule header -->

## Behavior

This rule keeps object destructuring out of a React function component parameter list. Components accept a named parameter and destructure it inside the body.

Optional policy can also require one canonical parameter name and one canonical rest binding name.

## Options

```js
{
  "friday/props-in-body": ["error", {
    "parameterName": "props",
    "restName": "rest"
  }]
}
```

## Examples

### Reported

```tsx
function Button({label}: ButtonProps) {
  return <button>{label}</button>;
}
```

With `parameterName: "props"`:

```tsx
function Button(properties: ButtonProps) {
  return <button>{properties.label}</button>;
}
```

With `restName: "rest"`:

```tsx
function Button(props: ButtonProps) {
  const {label, ...restProps} = props;
  return <button {...restProps}>{label}</button>;
}
```

### Accepted

```tsx
function Button(props: ButtonProps) {
  const {label, ...rest} = props;
  return <button {...rest}>{label}</button>;
}
```

## Scope and limitations

The rule checks components recognized by `@eslint-react/core`. Parameter and rest naming are opt-in so existing consumers keep the previous behavior until the shared config enables the stricter contract. Rest-name enforcement applies to direct object destructuring from the component props parameter in the component body.
