# jsx-no-sub-interface

💼 This rule is enabled in the ⚛️ `react/recommended` config.

<!-- end auto-generated rule header -->

Disallow sub-interfaces and helper types in component files; keep only the main component props.

## Rationale

A component file should declare exactly the props type its component consumes. Extra interfaces and helper type aliases signal that a data shape or a second component is hiding in the file. Extracting them keeps each component file focused and its types reusable.

## Examples

❌ Incorrect

```tsx
// StoreCard.tsx
interface StoreCardProps {
  address: StoreCardAddressProps;
}
interface StoreCardAddressProps {
  label: string;
}
const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
```

✅ Correct

```tsx
// StoreCard.tsx
import type { StoreCardAddressProps } from "./store-card-address.types";

interface StoreCardProps {
  address: StoreCardAddressProps;
}
const StoreCard = (props: Readonly<StoreCardProps>) => <div />;
```

The rule only runs when the file contains at least one PascalCase component. Each component's first-parameter type, unwrapping `Readonly`, `Required`, `Partial`, `PropsWithChildren`, and `NoInfer`, is treated as a main type and allowed; every other top-level interface or type alias is flagged, even when exported.

## Options

This rule has no options.

## When not to use

Disable it if you intentionally co-locate related types with their component.
