# prefer-named-parameter-types

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce a named interface or type for object parameter types instead of inline object type annotations.

## Rationale

Inline object types on parameters cannot be reused, are awkward to document, and clutter the function signature. A named interface or type alias makes the parameter shape reusable and keeps the signature concise. React components with a single non-destructured props parameter are deferred to `prefer-interface-over-inline-types`.

## Examples

❌ Incorrect

```ts
const foo = (params: { bar: string; baz: number }) => {
  const { bar, baz } = params;
};
```

✅ Correct

```ts
interface Params {
  bar: string;
  baz: number;
}

const foo = (params: Params) => {
  const { bar, baz } = params;
};
```

The rule checks function declarations, function expressions, arrow functions, method signatures, and method definitions, flagging each parameter whose type annotation is an inline object literal.

## Options

This rule has no options.

## When not to use

Disable it if you prefer inline object types for single-use callback parameters.
