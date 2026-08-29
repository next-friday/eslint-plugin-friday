# no-lint-suppression

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Ban lint suppression comments outright.

## Rationale

Suppression comments silently turn off checks the team opted into. They are configuration hidden inside source code where review tooling barely reaches. This repository forbids them instead of allowing them with explanations.

## Examples

❌ Incorrect

```ts
// @ts-ignore
const value = risky();

// @ts-expect-error
const other = riskier();

/* eslint-disable */
const legacy = load();

doWork(); // eslint-disable-line no-direct-date

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const anything = input as any;

// prettier-ignore
const matrix = [1, 2];
```

✅ Correct

```ts
// explaining a non-obvious algorithm is fine
const total = price * VAT_RATE;

/* ordinary block comments are fine */
const x = 1;
```

## Options

This rule has no options.

## When not to use

Do not disable this rule. If a suppression is genuinely needed, fix the underlying problem or scope the exception in configuration (e.g., ESLint override config files).
