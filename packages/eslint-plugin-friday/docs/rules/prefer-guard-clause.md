# prefer-guard-clause

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce the guard clause pattern instead of nested `if` statements.

## Rationale

Deeply nested conditionals push the meaningful code rightward and force the reader to hold every branch in mind. Inverting the condition into an early return flattens the function and makes the happy path obvious.

## Examples

❌ Incorrect

```ts
function process(data) {
  if (data) {
    if (data.items) {
      return data.items.map(toItem);
    }
  }
  return [];
}
```

✅ Correct

```ts
function process(data) {
  if (!data) return [];
  if (!data.items) return [];

  return data.items.map(toItem);
}
```

The rule flags an `if` whose only statement is a nested `if`, as well as `else if` chains written as a nested `if` consequent.

## Options

This rule has no options.

## When not to use

Disable it if your style guide favors nested conditionals over early returns.
