# no-direct-date

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow direct usage of the `Date` constructor and `Date` static methods to enforce centralized date utilities.

## Rationale

Scattering `new Date()`, `Date.now()`, and `Date.parse()` across a codebase makes time impossible to mock in tests and spreads timezone and parsing inconsistencies everywhere. Routing date handling through a single utility such as dayjs keeps formatting, parsing, and clock control in one place.

## Examples

❌ Incorrect

```ts
const date = new Date();
const timestamp = Date.now();
const ms = Date.parse("2024-01-01");
```

✅ Correct

```ts
import dayjs from "dayjs";

const date = dayjs();
const timestamp = dayjs().valueOf();
```

The rule flags `new Date(...)`, `Date.now()`, and `Date.parse()`. Other objects or classes that happen to expose `now` or `parse` are not affected.

## Options

### `utilityName`

The name of the date utility to recommend in the report message. Defaults to a generic `"a centralized date utility"`; set it to the library your project standardizes on so the message points developers at the right place.

```ts
// eslint.config.mjs
"friday/no-direct-date": ["error", { utilityName: "date-fns" }];
```

## When not to use

Disable it inside the date utility module itself, or if your project does not centralize date handling.
