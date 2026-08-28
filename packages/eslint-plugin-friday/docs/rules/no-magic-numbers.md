# no-magic-numbers

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow magic numbers outside well-known values, since unnamed constants hide intent and invite drift between duplicated literals.

## Rationale

A number appearing in logic without a name forces every reader to reverse-engineer its meaning. Extracting it into a named constant turns an anonymous value into documented domain knowledge, and `enforceConst` keeps such bindings from being silently reassigned.

## Examples

❌ Incorrect

```ts
const total = price * 1.21;
setTimeout(start, 3000);
const third = data[2];
function resize(height = 768) {}
class Meter {
  capacity = 60 * 60;
}
let seconds = 60;
```

✅ Correct

```ts
const VAT_RATE = 1.21;
const total = price * VAT_RATE;

const TIMEOUT_MS = 3000;
setTimeout(start, TIMEOUT_MS);

const SECONDS_PER_HOUR = 60 * 60;
class Meter {
  capacity = SECONDS_PER_HOUR;
}
const seconds = 60;
```

## Defaults

The rule ships strict out of the box. Consumers configuring it explicitly reproduce this baseline:

```jsonc
"friday/no-magic-numbers": [
  "error",
  {
    "ignore": [0, 1],
    "ignoreArrayIndexes": false,
    "ignoreDefaultValues": false,
    "ignoreClassFieldInitialValues": false,
    "enforceConst": true,
  }
]
```

- `ignore` — values exempt everywhere, including bigint entries written as strings such as `"100n"`
- `ignoreArrayIndexes` — when true, exempts valid array indexes from `0` through `4294967294`
- `ignoreDefaultValues` — when true, exempts parameter and destructuring defaults
- `ignoreClassFieldInitialValues` — when true, exempts class field initializers
- `enforceConst` — requires numeric bindings on declarations to use `const`

Declarations themselves never report as magic; they are where named constants are born, so only `enforceConst` applies to them. Object property values, object keys, assignments to members such as `this.retries = 5`, `parseInt` radix arguments, and numbers inside JSX props are always allowed.

## TypeScript policy

Enum member initializers are named constants and are always allowed. Numbers in type space such as `type Mode = 2 | 3`, indexed access types, and interface members are compile-time-only and are always allowed.

## Limitations

- Object property values are not reported even when duplicated across objects. Set up an explicit schema or constant map when that matters.
- The option surface is intentionally smaller than the frozen ESLint core rule; unsupported toggles stay fixed at their opinionated defaults.
