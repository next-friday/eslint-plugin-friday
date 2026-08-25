# boolean-naming

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce a boolean prefix such as `is`, `has`, `should`, `can`, `did`, `will`, `was`, `are`, `does`, or `had` on boolean variables and parameters.

## Rationale

A boolean identifier reads as a yes/no question. Prefixing it as `isActive` or `hasItems` makes that intent obvious at the call site, so readers do not have to inspect the value or type to know it is a flag.

## Examples

❌ Incorrect

```ts
const active = true;
const equal = a === b;
function process(active: boolean) {}
const fn = (enabled = false) => {};
```

✅ Correct

```ts
const isActive = true;
const isEqual = a === b;
function process(isActive: boolean) {}
const fn = (canEdit = false) => {};
```

A name matches a prefix only on a camelCase boundary, so `isolated` is not treated as the `is` prefix.

## Options

This rule accepts one options object with a single property:

- `allow`: an array of boolean variable or parameter names exempt from the prefix requirement, such as `loading` or `disabled`. Defaults to `[]`.

## When not to use

Disable it if your codebase follows a different boolean-naming convention, or for code generated from external schemas where you do not control identifier names.
