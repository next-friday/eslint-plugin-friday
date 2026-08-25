# sort-destructuring

💼 This rule is enabled in the ✅ `base/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce alphabetical sorting of destructured properties with defaults first.

## Rationale

A predictable destructuring order makes object patterns scannable and keeps diffs minimal. Properties with default values are grouped first so the defaults of a function or assignment are easy to find.

## Examples

❌ Incorrect

```ts
const { d, b, a, c } = foo;
```

✅ Correct

```ts
const { a, b, c, d } = foo;
```

Properties with defaults come first, sorted alphabetically, followed by the remaining properties sorted alphabetically. Rest elements and non-identifier keys are ignored. The fixer reorders the destructured properties. When the destructured group contains a comment, the autofix is skipped so a reorder never strands the comment; the rule still reports.

## Options

This rule has no options.

## When not to use

Disable it if you order destructured properties by usage rather than alphabetically.
