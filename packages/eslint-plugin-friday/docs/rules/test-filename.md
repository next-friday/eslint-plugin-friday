# test-filename

💼 This rule is enabled in the ✅ `base/recommended` config.

<!-- end auto-generated rule header -->

Enforce that files containing test code are named `*.test.ts` or `*.test.tsx`.

## Rationale

A single, predictable test-file suffix lets test runners, coverage tools, and `tsconfig`/lint `include` globs target tests reliably. Test code hiding in a `.spec.ts` or plain `.ts` file can be silently skipped or shipped.

## Examples

❌ Incorrect

```ts
// user.spec.ts
describe("user", () => {});

// user.ts
test("works", () => {});
```

✅ Correct

```ts
// user.test.ts
describe("user", () => {});

// UserCard.test.tsx
test("renders", () => {});
```

A file is considered test code when it calls a test global such as `describe`, `it`, `test`, `beforeEach`, `beforeAll`, `afterEach`, or `afterAll`. The rule reports at most once per file. Files already named `*.test.ts` / `*.test.tsx` are skipped.

## Options

This rule has no options.

## When not to use

Disable it if your project standardizes on a different test suffix such as `*.spec.ts`.
