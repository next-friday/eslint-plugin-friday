# sort-type-required-first

💼 This rule is enabled in the ✅ `base/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce required properties come before optional properties in TypeScript interfaces and type aliases.

## Rationale

Listing required properties before optional ones mirrors how the type is consumed: the mandatory contract is read first, with optional refinements after. It also keeps interfaces visually consistent across the codebase.

## Examples

❌ Incorrect

```ts
interface Props {
  label?: string;
  alt: string;
  src: string;
}
```

✅ Correct

```ts
interface Props {
  alt: string;
  src: string;
  label?: string;
}
```

Only identifier-keyed property signatures are considered. The relative order within the required and optional groups is preserved; only the partition between them is enforced. The fixer moves required properties ahead of optional ones. When the member list contains a comment, the autofix is skipped so a reorder never strands the comment; the rule still reports.

## Options

This rule has no options.

## When not to use

Disable it if you order properties by meaning regardless of optionality.
