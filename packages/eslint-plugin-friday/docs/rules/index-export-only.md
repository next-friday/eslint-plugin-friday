# index-export-only

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Require index files to contain only imports, re-exports, and type declarations.

## Rationale

An `index` file works best as a thin barrel that aggregates and re-exports a module's public surface. Putting runtime logic such as functions, classes, mutable state, or side effects in a barrel makes import graphs opaque and encourages circular dependencies. Keeping implementation in dedicated modules and re-exporting it here keeps the entry point predictable.

## Examples

❌ Incorrect

```ts
// index.ts
function cn(...inputs) {
  return inputs.join(" ");
}

export { cn };
```

✅ Correct

```ts
// index.ts
export { cn } from "./cn";
export type { Props } from "./props";
```

The rule only runs on `index.*` files. It allows imports, re-exports, `export ... from`, type alias and interface declarations together with their inline exports, default exports of an identifier, and string directive prologues. Local runtime declarations and side-effect statements are reported.

## Options

This rule has no options.

## When not to use

Disable it if your project keeps implementation code directly in index files.
