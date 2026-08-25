# no-inline-nested-object

💼 This rule is enabled in the ✅ `base/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Require object or array values to span multiple lines when they contain nested objects or arrays, in function arguments, returns, arrow implicit returns, and JSX attributes.

## Rationale

A single-line collection that itself holds objects or arrays is hard to read and produces noisy diffs when any inner value changes. Spreading the outer collection across lines keeps each element on its own line and makes structural changes diff cleanly.

## Examples

❌ Incorrect

```tsx
useState({ a: { b: 1 } });
new Thing({ config: { enabled: true } });
const el = <Comp prop={{ a: { b: 1 } }} />;
```

✅ Correct

```tsx
useState({
  a: { b: 1 },
});
```

The rule is fixable: it rewrites the inline collection onto multiple lines. It only triggers when the value is currently single-line and contains a nested object or array. Data variable declarations are not checked.

## Options

This rule has no options.

## When not to use

Disable it if your formatter already governs collection layout or your project prefers compact inline literals.
