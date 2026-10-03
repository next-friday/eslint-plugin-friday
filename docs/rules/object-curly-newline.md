# object-curly-newline

📝 Require every non-empty object literal to use multiline braces.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Behavior

The rule applies to object literals (`ObjectExpression`):

- Empty object literals (`{}`) are unchanged.
- Every non-empty object literal must place its contents between multiline braces.
- Single-property and multi-property object literals follow the same brace policy.
- The rule does not use line-length heuristics and does not collapse multiline object literals back to one line.

## Examples

### Single property

```ts
const options = {
  enabled: true,
};
```

### Multiple properties

```ts
const options = {
  enabled: true,
  strict: true,
};
```

## Autofix and Prettier

The fixer changes only brace-adjacent whitespace. It does not reindent properties; the project's formatter remains responsible for indentation, commas, spacing, and line wrapping.

The rule deliberately avoids a `maxLineLength` option or single-line collapse behavior. This keeps ESLint from competing with Prettier's `printWidth` heuristics over whether a non-empty object should be compact or multiline.

The rule remains active alongside `eslint-config-prettier/flat`. Its tests verify that composing `eslint-config-prettier/flat` before or after the rule does not disable the rule.
