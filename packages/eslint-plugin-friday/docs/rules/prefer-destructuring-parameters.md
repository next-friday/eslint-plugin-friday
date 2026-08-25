# prefer-destructuring-parameters

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce destructuring for functions that declare at least `minParams` positional parameters, three by default.

## Rationale

Positional parameters make call sites ambiguous, as in `createUser(true, false, 3)`, and brittle to reorder. A single destructured options object gives every argument a name at the call site and lets callers pass them in any order.

## Examples

❌ Incorrect

```ts
function createUser(name, age, role) {}
const toItem = (label, value, fallback) => {};
```

✅ Correct

```ts
function createUser({ name, age, role }) {}
const toItem = ({ label, value, fallback }) => {};
```

The rule applies to function declarations and to function/arrow expressions assigned to a variable, property, or method, once they declare at least `minParams` parameters. Callback functions passed as call arguments are ignored, as are names starting with `_`, containing `$`, or matching a PascalCase component pattern. A trailing rest parameter is allowed.

## Options

### `minParams`

The minimum number of parameters at which destructuring is required. Defaults to `3`, so clear two-parameter functions such as `add(a, b)` are left alone while ambiguous multi-argument calls are still flagged. Set it to `2` to require destructuring for every multi-parameter function.

```ts
// eslint.config.mjs
"friday/prefer-destructuring-parameters": ["error", { minParams: 2 }];
```

## When not to use

Disable it if your project prefers positional parameters or relies heavily on multi-argument APIs.
