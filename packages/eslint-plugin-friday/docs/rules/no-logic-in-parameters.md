# no-logic-in-parameters

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow logic or conditions in function call arguments; extract them to a `const` first.

## Rationale

Conditional, logical, comparison, and negation expressions inline in an argument list hide intent and are hard to scan and debug. Naming the value in a `const` documents what it represents and gives a place to breakpoint.

## Examples

❌ Incorrect

```ts
functionFoo(condition ? value1 : value2);
functionFoo(a && b);
functionFoo(obj instanceof MyClass);
functionFoo([a === b]);
```

✅ Correct

```ts
const result = condition ? value1 : value2;
functionFoo(result);

const checked = a && b;
functionFoo(checked);
```

The rule flags ternary expressions, `!` negations, logical expressions using `&&`, `||`, or `??`, and comparison expressions using `==`, `===`, `<`, `in`, `instanceof`, and similar operators, when they are used directly as call or `new` arguments, including inside an inline array argument.

## Options

This rule accepts one options object with a single property:

- `allow`: an array of callee names whose call arguments are not checked. A name matches a bare identifier callee such as `clsx` or `expect`, or the trailing property of a member callee such as the `t` in `i18n.t`. Defaults to `[]`, so the default behavior is unchanged.

Use it to exempt utilities where an inline condition is idiomatic, such as class-name builders, i18n lookups, and test assertions:

```json
{
  "friday/no-logic-in-parameters": [
    "error",
    { "allow": ["clsx", "cn", "cva", "t", "expect"] }
  ]
}
```

## When not to use

Disable it if your project tolerates inline expressions in argument lists.
