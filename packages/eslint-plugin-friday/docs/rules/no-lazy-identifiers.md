# no-lazy-identifiers

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow lazy, meaningless identifiers such as repeated characters or keyboard-row runs that hurt readability.

## Rationale

Names like `xxx`, `aaa`, or `asdf` are placeholder noise: they carry no meaning and survive into committed code far too often. Requiring a descriptive name keeps the codebase self-explanatory.

## Examples

❌ Incorrect

```ts
const xxx = "value";
const asdf = "keyboard";
function aaaa() {}
const { xxx } = obj;
```

✅ Correct

```ts
const userName = "value";
const searchQuery = "keyboard";
function calculateTotal() {}
const { name } = obj;
```

An identifier is flagged when it is at least 3 characters and either repeats a character 3 or more times in a row or has a camelCase or numeric segment that is itself a 4-character-or-longer keyboard-row run such as `asdf`, `qwer`, or `zxcv`. The check runs per segment, so a run embedded in a real word such as the `erty` inside `property` is not flagged, while a deliberate mash such as `myAsdfVar` still is. Identifiers starting with `_` are exempt. Variables, parameters, destructured bindings, functions, classes, type aliases, and interfaces are all checked.

## Options

This rule accepts one options object with a single property:

- `allow`: an array of exact identifier names to exempt from the rule. Defaults to `[]`.

```json
{
  "friday/no-lazy-identifiers": ["error", { "allow": ["aaa", "qwerty"] }]
}
```

## When not to use

Disable it if you rely on short throwaway identifiers in scratch or generated code.
