# no-nested-interface-declaration

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow inline object type literals nested inside interface or type properties.

## Rationale

Nested object literals bury reusable shapes inside a parent declaration, hurt IDE hover output, and cannot be referenced or extended elsewhere. Extracting them into named interfaces or type aliases keeps each shape discoverable and composable.

## Examples

❌ Incorrect

```ts
interface Props {
  user: {
    name: string;
    age: number;
  };
}
```

✅ Correct

```ts
interface User {
  name: string;
  age: number;
}

interface Props {
  user: User;
}
```

The rule also flags inline literals nested in array element types such as `{ ... }[]` and in type-reference arguments such as `Readonly<{ ... }>`.

## Options

This rule has no options.

## When not to use

Disable it if you prefer colocating small, single-use object shapes inline with their parent declaration.
