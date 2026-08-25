# hook-naming

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce a `use` prefix for functions exported from custom hook files named `*.hook.ts` or `*.hooks.ts`.

## Rationale

React requires hooks to start with `use` so the rules-of-hooks linting and runtime can recognize them. In files dedicated to hooks, every export should follow that convention.

## Examples

❌ Incorrect

```ts
// search-params.hook.ts
export function searchParamsHandler() {}
export const modalHandler = () => {};
export default handleSearch;
```

✅ Correct

```ts
// search-params.hook.ts
export function useSearchParamsHandler() {}
export const useModal = () => {};
export default useSearchParamsHandler;
```

The rule only runs in `*.hook.ts` / `*.hooks.ts` files. Both named and default exports are checked.

## Options

This rule has no options.

## When not to use

Disable it if your hook files intentionally export non-hook helpers alongside hooks.
