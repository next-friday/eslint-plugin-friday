# component-module

📝 Require React component modules to contain only imports, directives, export lists or re-exports, TypeScript interfaces, React function components, and explicitly allowed exported declarations.

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name                | Description                                                     | Type     | Default |
| :------------------ | :-------------------------------------------------------------- | :------- | :------ |
| `allowDeclarations` | Framework-owned declaration names allowed in component modules. | String[] | `[]`    |

<!-- end auto-generated rule options list -->

## Behavior

This rule keeps JSX and TSX component modules focused on imports, exports, and React function components. It reports unrelated top-level implementation so shared helpers and runtime values can live in regular modules.

## Examples

### Reported

The module-level constant is not a component or an allowed module statement:

```tsx
const buttonVariants = ["primary", "secondary"];

export function Button() {
  return <button className={buttonVariants[0]}>Save</button>;
}
```

### Accepted

Keep a component-specific value inside the component body:

```tsx
export function Button() {
  const buttonVariants = ["primary", "secondary"];

  return <button className={buttonVariants[0]}>Save</button>;
}
```

For a value shared by multiple components, move it to a regular module and import it:

```ts
// button-variants.ts
export const buttonVariants = ["primary", "secondary"];
```

```tsx
// Button.tsx
import {buttonVariants} from "./button-variants";

export function Button() {
  return <button className={buttonVariants[0]}>Save</button>;
}
```

## Scope and options

This rule is intended for JSX and TSX component modules. The rule itself does not inspect or restrict file extensions. The rule uses `@eslint-react/core` to identify React function components. Detected forms include function declarations, function expressions, arrow functions, and arrows passed to React's `memo` or `forwardRef`. Detection also considers function context and implementation signals such as JSX returns or Hook calls; other edge cases follow `@eslint-react/core`'s classification.

Allowed top-level statements are imports, export lists without an inline declaration, `export *`, directives, TypeScript interfaces, and declarations recognized as React function components. A variable declaration is allowed as a component declaration only when every declared variable is recognized as a component.

An export with a declaration is allowed when that declaration is a recognized component or interface, or when it is an exported function or variable declaration whose name appears in `allowDeclarations`. Standalone and exported type aliases, enums, classes, other helpers, runtime constants, and side-effect statements are reported. Export lists and re-exports without an inline declaration remain allowed. A `default` export whose declaration is an identifier is not treated as a component export.

`allowDeclarations` matches exact names and defaults to an empty list. It applies to exported function and variable declarations; for a variable statement with multiple declarations, every name must be listed. For example, a framework-owned `metadata` export can be opted in explicitly:

```js
rules: {
  "friday/component-module": ["error", {allowDeclarations: ["metadata"]}],
}
```
