# no-misleading-service-prefix

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow misleading function-name prefixes in `*.service.ts` files.

## Rationale

Service functions describe a domain operation. Vague verbs like `set`, `do`, `handle`, and `delete` hide intent; a more specific verb such as `update`, `submit`, `create`, or `remove` communicates what actually happens and keeps the service API self-documenting.

| Banned prefix | Suggested alternatives    |
| ------------- | ------------------------- |
| `delete`      | `remove`, `archive`       |
| `do`          | `submit`, `process`       |
| `handle`      | `create`, `verify`        |
| `set`         | `update`, `save`, `patch` |

## Examples

❌ Incorrect

```ts
// profile.service.ts
export async function setProfile(data: ProfileRequest) {}
export const handleOrder = async () => {};
```

✅ Correct

```ts
// profile.service.ts
export async function updateProfile(data: ProfileRequest) {}
export const createOrder = async () => {};
```

Only `async` exported functions in `*.service.ts` files are checked. A prefix matches only on a camelCase boundary, so `settings` and `domestic` are not flagged.

## Options

This rule has no options.

## When not to use

Disable it if your service layer uses a different verb vocabulary.
