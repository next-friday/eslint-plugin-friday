# no-inline-return-properties

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Require `return` object properties to use shorthand notation by extracting non-shorthand values to `const` variables first.

## Rationale

A returned object literal full of `key: someExpression` pairs buries computation inside the return. Computing each value into a `const` named after the key keeps the return statement a flat, scannable summary of what is exposed, using shorthand throughout.

## Examples

❌ Incorrect

```ts
function foo() {
  return { total: Math.ceil(items.length / PAGE_SIZE) };
}
```

✅ Correct

```ts
function foo() {
  const total = Math.ceil(items.length / PAGE_SIZE);

  return { total };
}
```

The rule flags any non-shorthand `Property` in a returned object literal. Shorthand properties and spread elements are allowed.

## Options

This rule has no options.

## When not to use

Disable it if your project allows computed values directly inside returned object literals.
