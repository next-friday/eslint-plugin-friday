# component-module

📝 Require React component modules to contain only component definitions, component-support declarations, imports, exports, directives, and explicitly allowed framework declarations.

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name                | Description                                                     | Type     | Default |
| :------------------ | :-------------------------------------------------------------- | :------- | :------ |
| `allowDeclarations` | Framework-owned declaration names allowed in component modules. | String[] | `[]`    |

<!-- end auto-generated rule options list -->

## Behavior

This rule keeps JSX and TSX component modules focused on React components and declarations that directly support those components. It reports unrelated top-level implementation so ordinary runtime values, helpers, data transformation, and business logic can be localized inside a component or moved to a regular module.

Generic component-support syntax is accepted without framework-specific configuration:

- TypeScript interfaces and type aliases.
- React function components recognized by `@eslint-react/core`.
- React contexts created through a verified `react` import.
- `Component.displayName = "..."` assignments for detected local components.
- Imports, directives, export lists, re-exports, and default exports of detected local components.

Framework-owned module declarations remain opt-in through `allowDeclarations` so the consuming ESLint config can scope them to the framework files that own those contracts.

## Examples

### Reported

The module-level constant is ordinary runtime implementation:

```tsx
const buttonVariants = ["primary", "secondary"];

export function Button() {
  return <button className={buttonVariants[0]}>Save</button>;
}
```

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

### Accepted

Props contracts, React context, and component metadata may stay beside the component:

```tsx
import {createContext} from "react";

type ButtonProps = {
  label: string;
};

const ButtonContext = createContext(null);

function Button(props: ButtonProps) {
  return <button>{props.label}</button>;
}

Button.displayName = "Button";

export {Button, ButtonContext};
```

## Scope and options

This rule is intended for JSX and TSX component modules. The rule itself does not inspect or restrict file extensions. The rule uses `@eslint-react/core` to identify React function components. Detected forms include function declarations, function expressions, arrow functions, and arrows passed to React's `memo` or `forwardRef`. Detection also considers function context and implementation signals such as JSX returns or Hook calls; other edge cases follow `@eslint-react/core`'s classification.

React context declarations are recognized only when `createContext` resolves from a direct, default, or namespace import from `react`. A same-named function imported from another module does not bypass the rule. Component metadata support is intentionally narrow and currently permits `displayName` assignments only when the assignment target is a detected module-scope component and the assigned value is a string literal.

Runtime constants, helper functions, enums, classes, namespaces, and side-effect statements remain reported by default. A variable declaration is allowed as a component or React-context declaration only when every declared variable satisfies the corresponding contract.

`allowDeclarations` matches exact names and defaults to an empty list. It applies to exported function and variable declarations; for a variable statement with multiple declarations, every name must be listed. Use it from a file-role-specific consuming config for framework-owned declarations rather than weakening the generic React policy globally. For example:

```js
rules: {
  "friday/component-module": ["error", {allowDeclarations: ["metadata"]}],
}
```
