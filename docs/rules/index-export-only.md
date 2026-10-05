# index-export-only

📝 Require index files to contain only public-surface syntax and narrowly scoped compound component API assembly.

<!-- end auto-generated rule header -->

## Behavior

An `index` file is a public entrypoint. Imports, re-exports, directives, and type declarations are allowed while unrelated runtime implementation is rejected.

Friday component entrypoints may assemble their consumer API from imported runtime bindings.

A compound component may use `Object.assign`:

```ts
import {AccordionBody, AccordionRoot} from "./accordion";

export const Accordion = Object.assign(AccordionRoot, {
  Body: AccordionBody,
  Root: AccordionRoot,
});
```

A root-only component may expose a PascalCase imported alias, and a namespace-only API may expose a PascalCase static object whose values are imported bindings. These are public-surface assembly, not implementation.

The assembly allowance is deliberately narrow: runtime aliases/namespaces must be PascalCase public bindings, and all exposed values must be imported runtime identifiers. Callbacks, computed runtime values, spreads, and arbitrary object construction are not accepted.

A local `*Compound` assembly may be exported through a matching public alias:

```ts
import {ButtonRoot} from "./button";

const ButtonCompound = Object.assign(ButtonRoot, {
  Root: ButtonRoot,
});

export {ButtonCompound as Button};
```

A paired local `*Compound` assembly followed by an exported typed bridge is also allowed for generic call-signature preservation.

## Examples

### Reported

```ts
export const config = Object.assign(
  {},
  {
    timeout: calculateTimeout(),
  },
);
```

### Accepted

```ts
export {Button} from "./button";
export type {ButtonProps} from "./button";
```

## Scope and exceptions

The rule applies when the filename without its final extension is exactly `index`. Default exports remain limited to identifier exports. Runtime implementation that is not a supported compound public API assembly must stay in an owning implementation module.
