# type-declaration-order

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce that referenced types and interfaces are declared after the type that uses them.

## Rationale

Declaring a type before the type that consumes it reads top-down: the high-level shape comes first, and its dependencies follow. This keeps related declarations close and a file's structure easy to follow.

## Examples

❌ Incorrect

```ts
interface Baz {
  baz: string;
}
interface Foo {
  bar: Baz;
}
```

✅ Correct

```ts
interface Foo {
  bar: Baz;
}
interface Baz {
  baz: string;
}
```

A type referenced from a property signature must be declared after the type that references it. External types and types not declared in the same file are ignored. This rule reports violations but does not autofix them.

## Options

This rule has no options.

## When not to use

Disable it if you prefer declaring dependencies before their consumers.
