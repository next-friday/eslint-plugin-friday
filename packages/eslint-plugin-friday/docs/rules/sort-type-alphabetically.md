# sort-type-alphabetically

💼 This rule is enabled in the ✅ `base/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce alphabetical sorting of properties within required and optional groups in TypeScript interfaces and type aliases.

## Rationale

Alphabetical ordering within each group makes large interfaces scannable and keeps diffs minimal when properties are added. Required and optional properties are sorted independently so the required-first convention is preserved.

## Examples

❌ Incorrect

```ts
interface Props {
  src: string;
  alt: string;
}
```

✅ Correct

```ts
interface Props {
  alt: string;
  src: string;
}
```

Only identifier-keyed property signatures are sorted. Required and optional groups are each sorted alphabetically and independently. The fixer reorders the properties within their group. When the member list contains a comment, the autofix is skipped so a reorder never strands the comment; the rule still reports.

## Options

This rule has no options.

## When not to use

Disable it if you group properties by meaning rather than alphabetically.
