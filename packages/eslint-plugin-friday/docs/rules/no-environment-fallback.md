# no-environment-fallback

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Disallow fallback/default values for environment variables, since silent defaults can hide missing or invalid configuration.

## Rationale

Reading an environment variable that was never set does not fail. The read evaluates to `undefined`, so a misconfigured deployment surfaces its problem later and unpredictably. A fallback substitutes another value whenever the variable is absent, nullish, or falsy through `||`, `??`, `||=`, `??=`, or a destructuring default. That substitution hides the misconfiguration instead of surfacing it.

## What this rule does

It reports direct fallback constructs whose candidate value comes from `process.env.*` or `import.meta.env.*`:

❌ Incorrect

```ts
const apiKey = process.env.API_KEY || "default-key";
const dbUrl = process.env.DATABASE_URL ?? "localhost";
process.env.API_URL ||= "http://localhost:3000";
const { PORT = "3000" } = process.env;
```

✅ Correct

```ts
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;
```

TypeScript wrappers around the environment read do not hide the fallback from this rule: `as`, `satisfies`, non-null assertions, and angle-bracket assertions are looked through.

## What this rule does not do

This rule does not validate your configuration. Reading an environment variable directly is permitted:

```ts
const apiUrl = process.env.API_URL;
```

That line alone guarantees nothing about fail-fast behavior. If a variable is required, validate it explicitly at the application boundary:

```ts
const apiUrl = process.env.API_URL;
if (!apiUrl) {
  throw new Error("API_URL is required");
}
```

Use a dedicated startup validation step or a schema library when you need stronger guarantees.

## Conditional use is not a fallback

Inspecting an environment variable is valid whenever no substitute value is supplied:

```ts
if (process.env.DEBUG) {
  enableDebug();
}

const logger = process.env.DEBUG ? debugLogger : productionLogger;

if (import.meta.env.DEV) {
  enableDevTools();
}
```

The last pattern is the documented Vite way to gate development tooling.

## Limitations

- A same-value ternary such as `process.env.VALUE ? process.env.VALUE : "default"` selects a substitute behind a condition and is not reported. Prefer `??` so the intent stays explicit and detectable.
- Aliases such as assigning `const env = process.env` and later reading `env.X ?? "fallback"` are not tracked.

## Options

This rule has no options.

## When not to use

Disable it if your project deliberately relies on environment fallbacks, for example, local-only tooling with safe defaults.
