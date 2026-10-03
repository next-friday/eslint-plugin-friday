# TypeScript-First Rules

Use TypeScript by default within TypeScript-capable applications and packages. This rule primarily targets React, Next.js, Node.js, and NestJS projects, including those inside a monorepo.

## File Choice

- In TypeScript-capable projects, use `.ts` for source, tests, and scripts, and `.tsx` for files containing JSX; choose TypeScript for new or materially rewritten code. In Node.js and NestJS projects, follow the runtime and toolchain's TypeScript support.
- Scope this choice to the owning app or package. In polyglot repositories, keep separately maintained components in their established languages.
- Use an extension required by the runtime, tool, or public contract; check the target configuration when TypeScript support is unclear.

## JavaScript Conversion

- When changing an existing JavaScript file in a TypeScript-capable app or package, convert the touched implementation when it fits the requested scope.
- Update affected imports, scripts, tests, and configuration with each conversion; keep changes in unrelated apps or packages for a separate migration.
