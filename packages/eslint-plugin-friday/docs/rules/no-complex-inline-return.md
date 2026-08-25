# no-complex-inline-return

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow complex inline expressions in `return` statements; prefer extracting them to a `const` first.

## Rationale

Returning a ternary, logical expression, or freshly constructed object inline forces the reader to evaluate the expression and the control flow at once. Binding the result to a named `const` first separates "what is computed" from "what is returned".

## Examples

❌ Incorrect

```ts
function foo() {
  return condition ? value1 : value2;
}

function bar() {
  return new MyClass();
}
```

✅ Correct

```ts
function foo() {
  const result = condition ? value1 : value2;

  return result;
}
```

The rule flags `return` arguments that are conditional expressions, `new` expressions, or logical expressions using `&&`, `||`, or `??`.

## Options

This rule has no options.

## When not to use

Disable it if your project favors concise inline returns over extracted intermediates.
