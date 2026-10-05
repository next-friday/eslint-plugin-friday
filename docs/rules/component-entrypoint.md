# component-entrypoint

📝 Require Friday component index entrypoints to expose a symmetric compound API and component props namespace.

<!-- end auto-generated rule header -->

## Behavior

This rule applies to `index.*` files and checks component public aliases that are assembled from a `*Root` binding.

The canonical public surface uses `Object.assign` even for root-only components:

```ts
export const Button = Object.assign(ButtonRoot, {
  Root: ButtonRoot,
});

export type Button = {
  Props: ComponentProps<typeof ButtonRoot>;
  RootProps: ComponentProps<typeof ButtonRoot>;
};
```

Compound static members require matching `ComponentProps` aliases:

```ts
export const Accordion = Object.assign(AccordionRoot, {
  Body: AccordionBody,
  Root: AccordionRoot,
});

export type Accordion = {
  BodyProps: ComponentProps<typeof AccordionBody>;
  Props: ComponentProps<typeof AccordionRoot>;
  RootProps: ComponentProps<typeof AccordionRoot>;
};
```

A narrow two-step `*Compound` bridge is also accepted when a generic component needs to preserve a specialized call signature before export.

## Options

Static compound API members that are utilities rather than React components can be excluded from `ComponentProps` alias requirements:

```js
{
  "friday/component-entrypoint": ["error", {
    "ignoreMembers": ["Queue", "toast"]
  }]
}
```

The root contract is never ignored: the component must still expose `Root: <Component>Root`, `Props`, and `RootProps`.

## Scope

The rule owns local entrypoint symmetry only. It does not check whether sibling implementation or variant files exist; cross-file package structure belongs to repository contract tests or generators.
