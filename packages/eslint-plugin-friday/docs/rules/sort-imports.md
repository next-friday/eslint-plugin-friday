# sort-imports

💼 This rule is enabled in the ✅ `base/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce a consistent ordering of import declarations.

## Rationale

Grouping imports by origin makes a file's dependencies scannable: side-effects first, then builtins, externals, internal aliases, and finally relative paths, each immediately followed by its type-only imports. Sorting declarations within each group reduces merge noise and keeps equivalent files deterministic without editor-specific commands.

## Examples

❌ Incorrect

```ts
import { foo } from "../foo";
import React from "react";
```

✅ Correct

```ts
import React from "react";

import { foo } from "../foo";
```

Imports are ordered by group: side-effect, builtin, external, internal alias such as `@/`, `~/`, or `#`, parent relative `../`, then relative `./` — each followed by its type imports. Within each subgroup, complete import declaration text is sorted case-sensitively in ascending JavaScript string order. A blank line is expected between distinct top-level groups. Non-import statements reset the run, so each contiguous block of imports is checked independently. The fixer moves whole declarations and inserts missing blank lines. When the import run contains a comment, the reorder is skipped so it never strands the comment; the rule still reports.

## Options

This rule has no options.

## When not to use

Disable it if you use another import-sorting tool with a conflicting convention.
