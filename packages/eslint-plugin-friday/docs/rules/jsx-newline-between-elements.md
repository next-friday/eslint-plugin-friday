# jsx-newline-between-elements

💼 This rule is enabled in the ⚛️ `react/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Require an empty line between sibling JSX elements when either sibling spans multiple lines.

## Rationale

Multi-line JSX siblings packed together are hard to scan. A blank line between them mirrors how paragraphs separate ideas, making the boundary between two block-level elements obvious. Single-line siblings are left untouched so compact lists stay compact.

## Examples

❌ Incorrect

```tsx
<div>
  <div>
    <Highlight />
  </div>
  <div>
    <Events />
  </div>
</div>
```

✅ Correct

```tsx
<div>
  <div>
    <Highlight />
  </div>

  <div>
    <Events />
  </div>
</div>
```

A blank line is required only when at least one of the two adjacent siblings is multi-line. The fixer inserts the missing blank line, but skips the fix when a comment sits between the siblings.

## Options

This rule has no options.

## When not to use

Disable it if your formatter already governs blank lines inside JSX, or if you prefer dense JSX without separators.
