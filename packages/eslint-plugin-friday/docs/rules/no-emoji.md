# no-emoji

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow emoji characters in source code.

## Rationale

Emoji render inconsistently across editors, terminals, and diff tools, and can encode invisible variation selectors or zero-width joiners that break greps and confuse reviewers. Keeping source code to plain text keeps it portable and unambiguous.

## Examples

❌ Incorrect

```ts
const message = "Hello 😀 World";
// celebrate 🎉
```

✅ Correct

```ts
const message = "Hello World";
// celebrate
```

The rule scans the full source text, including strings, comments, and template literals, and reports each emoji match individually.

## Options

This rule has no options.

## When not to use

Disable it if your project intentionally embeds emoji in user-facing string literals and has no tooling that mishandles them.
