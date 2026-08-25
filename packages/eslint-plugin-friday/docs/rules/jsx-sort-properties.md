# jsx-sort-properties

💼 This rule is enabled in the ⚛️ `react/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce JSX props are ordered by value type.

## Rationale

A consistent prop order makes elements scannable: simple strings first, complex values last. Grouping by value type rather than alphabetically keeps related props together and pushes noisy callbacks and JSX toward the end.

## Examples

❌ Incorrect

```tsx
<Component onClick={() => {}} count={42} title="hello" />
```

✅ Correct

```tsx
<Component title="hello" count={42} onClick={() => {}} />
```

Props are sorted by group, in this order: strings, hyphenated strings, numbers/booleans/null, expressions, objects/arrays, functions, JSX elements, then shorthand booleans. Spread attributes reset the ordering, so each run of props between spreads is sorted independently. The fixer reorders props within each run.

## Options

This rule has no options.

## When not to use

Disable it if you prefer alphabetical prop sorting or a different ordering convention.
