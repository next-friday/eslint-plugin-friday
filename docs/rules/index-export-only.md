# index-export-only

📝 Require index files to contain only imports, exports without inline runtime implementation, directives, and type declarations.

<!-- end auto-generated rule header -->

## Behavior

An `index` file is a public barrel: it gathers exports while implementation stays in feature modules. This rule reports runtime declarations and other implementation statements in matching index files.

## Examples

### Reported

The exported value is implemented in the barrel. Put the implementation in its owning feature module, then re-export it from the index file:

```ts
export const componentCount = 3;
```

### Accepted

Re-export runtime values and types from their implementation modules:

```ts
export {Button} from "./button";
export type {ButtonProps} from "./button";
```

## Scope and exceptions

The rule applies when the filename without its final extension is exactly `index` (for example, `index.ts` or `index.tsx`). It does not apply to names such as `index.test.ts`.

Allowed top-level statements are imports, TypeScript external-module `import = require(...)` declarations, directives, interfaces, type aliases, `export *`, and named export lists, including local export lists and re-exports. A named export may also declare an interface or type alias.

A default export is allowed only when its declaration is an identifier, such as `export default Component`. Inline default function or class declarations and other default expressions, such as literals, are reported. Runtime declarations and other top-level implementation statements are reported.
