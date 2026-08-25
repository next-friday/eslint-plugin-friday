# render-naming

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce a `render` prefix for variables that hold or return JSX inside React components.

## Rationale

Inside a component, a variable that produces JSX is a render fragment. Prefixing it as `renderHeader` or `renderCardElements` signals that the value is markup, distinguishing it from data and making the render flow easier to scan.

## Examples

❌ Incorrect

```tsx
const Component = () => {
  const header = <div />;
  const cardElements = items.map((item) => <Card {...item} />);
  return header;
};
```

✅ Correct

```tsx
const Component = () => {
  const renderHeader = <div />;
  const renderCardElements = items.map((item) => <Card {...item} />);
  return renderHeader;
};
```

The rule only runs in `.tsx` / `.jsx` files and only inside PascalCase component functions. JSX-producing values include JSX elements/fragments, conditionals, logical expressions, `.map`/`.flatMap`/`.filter` results, and functions returning JSX.

## Options

This rule accepts one options object with a single property:

- `allow`: an array of JSX local names exempt from the render-prefix requirement, such as `content` or `fallback`. Defaults to `[]`.

## When not to use

Disable it if you do not want a naming convention distinguishing render fragments from other locals.
