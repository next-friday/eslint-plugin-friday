# no-js-files

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow `.js` and `.jsx` file extensions.

## Rationale

TypeScript-only codebases should not contain JavaScript source files. This rule enforces the policy at the IDE level, replacing ad-hoc bash validation scripts with first-class lint feedback.

## Examples

❌ Incorrect

```ts
// File: example.js
const message = "Hello World";
```

```ts
// File: Component.jsx
export const Component = () => <div>Hello</div>;
```

✅ Correct

```ts
// File: example.ts
const message = "Hello World";
```

```ts
// File: Component.tsx
export const Component = () => <div>Hello</div>;
```

## Options

```json
{
  "friday/no-js-files": [
    "error",
    {
      "allowList": ["next.config.js", "*.config.js"]
    }
  ]
}
```

### `allowList`

Type: `string[]`

Default: `[]`

List of filename patterns to exempt from the rule. Supports exact filenames and glob patterns (using `*` as wildcard).

## When not to use

Disable it if your project intentionally mixes JavaScript and TypeScript source files, or if you rely on framework-mandated JavaScript configuration files that cannot be renamed.
