# prefer-react-import-types

💼 This rule is enabled in the ⚛️ `react/recommended` config.

<!-- end auto-generated rule header -->

Enforce importing React types and utilities directly from `react` instead of accessing them through the `React.` namespace.

## Rationale

Named imports such as `import { useState } from "react"` tree-shake better, read more cleanly, and avoid depending on a `React` namespace binding that modern JSX runtimes no longer require. Type members are imported with `import type` to keep them out of the runtime bundle.

## Examples

❌ Incorrect

```tsx
const Component: React.FC = () => <div>Hello</div>;
const [state, setState] = React.useState(0);
```

✅ Correct

```tsx
import type { FC } from "react";
import { useState } from "react";

const Component: FC = () => <div>Hello</div>;
const [state, setState] = useState(0);
```

The rule flags both value access such as `React.useState` and type references such as `React.FC`, reporting the exact named import to add. It does not autofix: stripping the `React.` prefix without inserting the matching import would leave the identifier undefined, so the rule reports the change and leaves you to add the named import and drop the prefix.

## Options

This rule has no options.

## When not to use

Disable it if your codebase deliberately uses the `React.` namespace style throughout.
