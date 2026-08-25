# no-environment-fallback

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow fallback values for environment variables, since silent defaults can be dangerous in production.

## Rationale

A missing environment variable should fail loudly. Providing a fallback with `||`, `??`, or a ternary lets a misconfigured deployment silently run with a default secret, URL, or flag, which is far harder to detect than an immediate startup error.

## Examples

❌ Incorrect

```ts
const apiKey = process.env.API_KEY || "default-key";
const dbUrl = process.env.DATABASE_URL ?? "localhost";
const port = process.env.PORT ? "8080" : "3000";
```

✅ Correct

```ts
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is required");
}
```

The rule flags `||` and `??` expressions whose left side is `process.env.*` or `import.meta.env.*`, and ternaries whose test is one of those.

## Options

This rule has no options.

## When not to use

Disable it if your project deliberately relies on environment fallbacks, for example, local-only tooling with safe defaults.
