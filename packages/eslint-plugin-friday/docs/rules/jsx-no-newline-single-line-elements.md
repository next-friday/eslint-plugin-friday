# jsx-no-newline-single-line-elements

💼 This rule is enabled in the ⚛️ `react/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow empty lines between single-line sibling JSX elements.

## Rationale

A blank line between two compact, single-line elements adds vertical noise without separating distinct ideas. Keeping single-line siblings adjacent makes short lists and groups read as one unit. This is the complement of `jsx-newline-between-elements`, which governs multi-line siblings.

## Examples

❌ Incorrect

```tsx
<div>
  <div>One</div>

  <div>Two</div>
</div>
```

✅ Correct

```tsx
<div>
  <div>One</div>
  <div>Two</div>
</div>
```

The rule only fires when both adjacent siblings are single-line JSX elements. The fixer collapses the blank line while preserving indentation. A `{/* ... */}` expression between two siblings breaks their adjacency, so the rule does not fire across it.

## Options

This rule has no options.

## When not to use

Disable it if your formatter owns blank-line placement in JSX, or if you intentionally space out single-line elements.
