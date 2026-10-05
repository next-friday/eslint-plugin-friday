# component-entrypoint

📝 Require Friday component index entrypoints to expose a canonical compound API.

<!-- end auto-generated rule header -->

## Behavior

This rule applies to `index.*` files and checks component public aliases that are assembled from a `*Root` binding.

The canonical public surface uses `Object.assign` even for root-only components:

```ts
export const Button = Object.assign(ButtonRoot, {
  Root: ButtonRoot,
});
```

Compound static members are validated as runtime bindings:

```ts
export const Accordion = Object.assign(AccordionRoot, {
  Body: AccordionBody,
  Root: AccordionRoot,
});
```

The rule validates runtime assembly only. It does not require a same-name `export type Button = {...}` contract; prop types can be published independently through named exports such as `ButtonProps` and `ButtonRootProps`.

A narrow two-step `*Compound` bridge is also accepted when a generic component needs to preserve a specialized call signature before export.

## Options

`ignoreMembers` is retained as a compatibility option for existing configurations. It no longer changes diagnostics because the rule does not validate `ComponentProps` aliases.

Existing configurations may keep or remove the option:

```js
{
  "friday/component-entrypoint": ["error", {
    "ignoreMembers": ["Queue", "toast"]
  }]
}
```

## Scope

The rule owns local runtime entrypoint symmetry only. It does not own props type aliases or check whether sibling implementation or variant files exist; cross-file package structure belongs to repository contract tests or generators.
