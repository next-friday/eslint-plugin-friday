# no-misleading-constant-case

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow `SCREAMING_SNAKE_CASE` for non-constant or non-static values.

## Rationale

`SCREAMING_SNAKE_CASE` signals a fixed, module-level constant. Using it for a `let`/`var`, a local variable, or a dynamically computed value misleads the reader into assuming immutability and global reach. This rule is the inverse guard to `constant-case`.

## Examples

❌ Incorrect

```ts
let API_URL = "https://api.example.com"; // mutable binding
const API_URL = getUrl(); // dynamic value
function foo() {
  const MAX_RETRY = 3;
} // local scope
```

✅ Correct

```ts
const API_URL = "https://api.example.com"; // static global constant
let apiUrl = "https://api.example.com";
const url = getUrl();
function foo() {
  const maxRetry = 3;
}
```

The rule reports three situations: `let`/`var` declared in `SCREAMING_SNAKE_CASE`, `SCREAMING_SNAKE_CASE` in local/component scope, and global `const` in `SCREAMING_SNAKE_CASE` whose initializer is not a static primitive, array, object, or `as const`.

## Options

This rule has no options.

## When not to use

Disable it if your project intentionally uses `SCREAMING_SNAKE_CASE` for computed or scoped values.
