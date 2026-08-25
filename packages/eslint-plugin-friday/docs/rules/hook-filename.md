# hook-filename

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce that files exporting custom hooks are named `*.hook.ts` or `*.hooks.ts`.

## Rationale

Co-locating hooks in clearly named files makes the codebase navigable: a `use`-prefixed export living in a plain `.ts` file hides the fact that it is a hook. This rule is the filename counterpart to `hook-naming`.

## Examples

❌ Incorrect

```ts
// use-user-data.ts
export function useUserData() {
  return null;
}

// UserCard.tsx
export function useUserCard() {
  return null;
}
```

✅ Correct

```ts
// use-user-data.hook.ts
export function useUserData() {
  return null;
}

// user.service.ts — non-hook export, allowed anywhere
export function fetchUserData() {
  return null;
}
```

A function is treated as a hook when its name matches `use[A-Z]...`. Re-exports and a bare `use` are not flagged. Files already named `*.hook.ts` / `*.hooks.ts` are skipped.

## Options

This rule has no options.

## When not to use

Disable it if your project organizes hooks by directory rather than by filename suffix.
