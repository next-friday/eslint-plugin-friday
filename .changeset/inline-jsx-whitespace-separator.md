---
"@next-friday/eslint-plugin-friday": patch
---

`friday/jsx-newline-between-elements` no longer requires empty lines around Prettier's inline JSX whitespace separator `{" "}`. Inline text with multi-line links, such as `Head over to{" "}<a>…</a>{" "}center.`, now passes both ESLint and Prettier instead of oscillating between their fixes.
