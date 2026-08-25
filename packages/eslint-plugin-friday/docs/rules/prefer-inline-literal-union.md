# prefer-inline-literal-union

💼 This rule is enabled in the ✅ `base/recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Inline literal union type aliases at their property usage sites, and remove an alias that inlining leaves unused.

## Rationale

When an interface property references a type alias that is just a union of literals such as `"a" | "b" | "c"`, IDE hover shows the alias name rather than the allowed values. Inlining the union at the property surfaces the literal members directly on hover, improving discoverability. When inlining leaves the alias unused, the fixer removes it so no dead declaration is left behind; an alias still referenced elsewhere, such as in a function parameter, is kept.

## Examples

❌ Incorrect

```ts
type Status = "loading" | "success" | "error";

interface Props {
  status: Status;
}
```

✅ Correct

```ts
interface Props {
  status: "loading" | "success" | "error";
}
```

When the alias is referenced elsewhere, the fixer inlines each property but keeps the alias:

```ts
type Status = "loading" | "success" | "error";

interface Props {
  status: "loading" | "success" | "error";
}

function check(value: Status): void {}
```

Only aliases whose members are all literals, `null`, or `undefined` are inlined. Mixed unions such as `"a" | string` and object-type aliases are left alone. The fixer replaces the property's type reference with the alias body text and removes the alias when no other reference remains.

## Options

This rule has no options.

## When not to use

Disable it if you prefer referencing the named alias for brevity over surfacing literal members on hover.
