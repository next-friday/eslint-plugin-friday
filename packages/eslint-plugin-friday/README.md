# eslint-plugin-friday

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=next-friday_eslint-plugin-friday&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=next-friday_eslint-plugin-friday)
[![codecov](https://codecov.io/gh/next-friday/eslint-plugin-friday/graph/badge.svg)](https://codecov.io/gh/next-friday/eslint-plugin-friday)
[![npm version](https://img.shields.io/npm/v/eslint-plugin-friday.svg)](https://www.npmjs.com/package/eslint-plugin-friday)

Opinionated ESLint rules for consistent, readable TypeScript and React codebases.

`eslint-plugin-friday` ships **45 rules** across two flat-config presets. Each preset comes in a `warn` variant and a stricter `recommended` variant set to `error`. The rules push code toward one explicit, uniform shape — predictable naming, flat structure, and no hidden complexity — so the whole team reads and reviews the codebase the same way.

## Features

- **45 focused rules** spanning naming, file structure, imports, types, and React and JSX patterns.
- **Flat config only**, built for ESLint 9+ and `eslint.config.mjs`.
- **Two presets and two severities** — `base` and `react`, each available as `warn` or `recommended`.
- **Fully typed**, shipped as dual ESM and CommonJS with type definitions for both.
- **Every rule documented** with rationale, valid and invalid examples, options, and a when-not-to-use note.
- **100% test coverage**, enforced in CI.

## Requirements

- ESLint `>=9` with flat config
- Node.js `>=22.10.0`

## Installation

```sh
pnpm add -D eslint-plugin-friday
```

`npm install -D eslint-plugin-friday` and `yarn add -D eslint-plugin-friday` work the same way.

## Usage

Add a preset to `eslint.config.mjs`:

```js
import friday from "eslint-plugin-friday";

export default [
  friday.configs["base/recommended"],
  friday.configs["react/recommended"],
];
```

The `react` preset adds only the React and JSX rules, so a React project enables both the `base` and `react` presets, as shown above.

### Choose a preset and severity

| Config              | Severity | Scope                   |
| ------------------- | -------- | ----------------------- |
| `base`              | `warn`   | Any TypeScript project  |
| `base/recommended`  | `error`  | Any TypeScript project  |
| `react`             | `warn`   | React and JSX projects  |
| `react/recommended` | `error`  | React and JSX projects  |
| `all`               | `warn`   | Every rule, both layers |
| `all/recommended`   | `error`  | Every rule, both layers |

The `all` and `all/recommended` presets enable every rule the plugin ships, across both the base and React layers.

### Enable a single rule

```js
import friday from "eslint-plugin-friday";

export default [
  {
    plugins: { friday },
    rules: {
      "friday/no-direct-date": "error",
    },
  },
];
```

## Migrating from the legacy namespace

The ESLint plugin namespace changed from `next-friday` to `friday`. Rewrite configuration written against the old namespace:

| Before                          | After                          |
| ------------------------------- | ------------------------------ |
| `nextFriday`                    | `friday`                       |
| `plugins["next-friday"]`        | `plugins.friday`               |
| `next-friday/no-direct-date`    | `friday/no-direct-date`        |
| `next-friday/base`              | `friday/base`                  |
| `next-friday/base/recommended`  | `friday/base/recommended`      |
| `next-friday/react`             | `friday/react`                 |
| `next-friday/react/recommended` | `friday/react/recommended`     |

Rule overrides such as `"next-friday/no-direct-date": "off"` stop matching after this change. The npm package name `eslint-plugin-friday` and the GitHub organization `next-friday` keep their names.

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `base/recommended` configuration.\
⚛️ Set in the `react/recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                                                                 | Description                                                                                                                                                              | 💼 | 🔧 |
| :--------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :- | :- |
| [boolean-naming](docs/rules/boolean-naming.md)                                                       | Enforce boolean variables and parameters to have a prefix like is, has, should, can, did, will for better readability                                                    | ✅  |    |
| [constant-case](docs/rules/constant-case.md)                                                         | Enforce SCREAMING_SNAKE_CASE for global magic-number, magic-text, bigint, and RegExp constants                                                                           | ✅  |    |
| [hook-filename](docs/rules/hook-filename.md)                                                         | Enforce that files exporting custom hooks are named *.hook.ts or *.hooks.ts                                                                                              | ✅  |    |
| [hook-naming](docs/rules/hook-naming.md)                                                             | Enforce 'use' prefix for functions in *.hook.ts and *.hooks.ts files                                                                                                     | ✅  |    |
| [index-export-only](docs/rules/index-export-only.md)                                                 | Require index files to contain only imports, re-exports, and type declarations                                                                                           | ✅  |    |
| [jsx-newline-between-elements](docs/rules/jsx-newline-between-elements.md)                           | Require empty lines between sibling JSX elements                                                                                                                         | ⚛️ | 🔧 |
| [jsx-no-data-array](docs/rules/jsx-no-data-array.md)                                                 | Disallow top-level arrays of object literals in .tsx/.jsx files; extract them to a data file                                                                             | ⚛️ |    |
| [jsx-no-data-object](docs/rules/jsx-no-data-object.md)                                               | Disallow top-level nested object literals in .tsx/.jsx files; extract them to a data file                                                                                | ⚛️ |    |
| [jsx-no-newline-single-line-elements](docs/rules/jsx-no-newline-single-line-elements.md)             | Disallow empty lines between single-line sibling JSX elements                                                                                                            | ⚛️ | 🔧 |
| [jsx-no-non-component-function](docs/rules/jsx-no-non-component-function.md)                         | Disallow non-component functions defined at top level in .tsx and .jsx files                                                                                             | ⚛️ |    |
| [jsx-no-sub-interface](docs/rules/jsx-no-sub-interface.md)                                           | Disallow sub-interfaces and helper types in component files; keep only the main component props and extract the rest                                                     | ⚛️ |    |
| [jsx-require-suspense](docs/rules/jsx-require-suspense.md)                                           | Require lazy-loaded components to be wrapped in Suspense                                                                                                                 | ⚛️ |    |
| [jsx-simple-properties](docs/rules/jsx-simple-properties.md)                                         | Enforce JSX props to only contain strings, simple variables, or ReactNode elements                                                                                       | ⚛️ |    |
| [jsx-sort-properties](docs/rules/jsx-sort-properties.md)                                             | Enforce JSX props are sorted by value type: strings, hyphenated strings, numbers/booleans, expressions, objects/arrays, functions, JSX elements, then shorthand booleans | ⚛️ | 🔧 |
| [jsx-spread-properties-last](docs/rules/jsx-spread-properties-last.md)                               | Enforce JSX spread attributes appear after all other props                                                                                                               | ⚛️ |    |
| [no-complex-inline-return](docs/rules/no-complex-inline-return.md)                                   | Disallow complex inline expressions in return statements - prefer extracting to a const first                                                                            | ✅  |    |
| [no-direct-date](docs/rules/no-direct-date.md)                                                       | Disallow direct usage of Date constructor and methods to enforce centralized date utilities                                                                              | ✅  |    |
| [no-emoji](docs/rules/no-emoji.md)                                                                   | Disallow emoji characters in source code                                                                                                                                 | ✅  |    |
| [no-environment-fallback](docs/rules/no-environment-fallback.md)                                     | Disallow fallback/default values for environment variables because they can hide missing configuration                                                                   | ✅  |    |
| [no-ghost-wrapper](docs/rules/no-ghost-wrapper.md)                                                   | Disallow bare <div> and <span> elements that have no meaningful attributes, known as Divitis or ghost wrappers                                                           | ⚛️ |    |
| [no-inline-nested-object](docs/rules/no-inline-nested-object.md)                                     | Require object or array values passed to functions, returned, or used as JSX attributes to span multiple lines when they contain nested objects or arrays                | ✅  | 🔧 |
| [no-inline-return-properties](docs/rules/no-inline-return-properties.md)                             | Require return object properties to use shorthand notation by extracting non-shorthand values to const variables                                                         | ✅  |    |
| [no-js-files](docs/rules/no-js-files.md)                                                             | Disallow .js and .jsx file extensions                                                                                                                                    | ✅  |    |
| [no-lazy-identifiers](docs/rules/no-lazy-identifiers.md)                                             | Disallow lazy, meaningless variable names that hurt code readability                                                                                                     | ✅  |    |
| [no-lint-suppression](docs/rules/no-lint-suppression.md)                                             | Ban lint suppression comments                                                                                                                                            | ✅  |    |
| [no-logic-in-parameters](docs/rules/no-logic-in-parameters.md)                                       | Disallow logic or conditions in function parameters - extract to a const variable first                                                                                  | ✅  |    |
| [no-magic-numbers](docs/rules/no-magic-numbers.md)                                                   | Disallow magic numbers outside well-known values because unnamed constants hide intent                                                                                   | ✅  |    |
| [no-misleading-constant-case](docs/rules/no-misleading-constant-case.md)                             | Disallow SCREAMING_SNAKE_CASE for non-constant or non-static values                                                                                                      | ✅  |    |
| [no-misleading-service-prefix](docs/rules/no-misleading-service-prefix.md)                           | Disallow misleading function name prefixes in *.service.ts files                                                                                                         | ✅  |    |
| [no-nested-interface-declaration](docs/rules/no-nested-interface-declaration.md)                     | Disallow inline object type literals in interface or type properties                                                                                                     | ✅  |    |
| [prefer-destructuring-parameters](docs/rules/prefer-destructuring-parameters.md)                     | Enforce destructuring for functions with multiple parameters                                                                                                             | ✅  |    |
| [prefer-guard-clause](docs/rules/prefer-guard-clause.md)                                             | Enforce guard clause pattern instead of nested if statements                                                                                                             | ✅  |    |
| [prefer-inline-literal-union](docs/rules/prefer-inline-literal-union.md)                             | Enforce inlining literal union types in interface properties instead of using type aliases for better IDE hover information                                              | ✅  | 🔧 |
| [prefer-interface-for-component-properties](docs/rules/prefer-interface-for-component-properties.md) | Enforce 'interface' over 'type' alias for component prop declarations in *.tsx and *.jsx files                                                                           | ⚛️ | 🔧 |
| [prefer-interface-over-inline-types](docs/rules/prefer-interface-over-inline-types.md)               | Enforce interface declarations over inline type annotations for React component props                                                                                    | ✅  |    |
| [prefer-named-parameter-types](docs/rules/prefer-named-parameter-types.md)                           | Enforce named interfaces/types instead of inline object types for function parameters                                                                                    | ✅  |    |
| [prefer-properties-with-children](docs/rules/prefer-properties-with-children.md)                     | Prefer PropsWithChildren<T> over manually declaring children: ReactNode in component props                                                                               | ⚛️ |    |
| [prefer-react-import-types](docs/rules/prefer-react-import-types.md)                                 | Enforce importing React types and utilities from 'react' instead of using React.X                                                                                        | ⚛️ |    |
| [prefer-readonly-component-properties](docs/rules/prefer-readonly-component-properties.md)           | Enforce Readonly wrapper for React component props when using named types or interfaces                                                                                  | ⚛️ | 🔧 |
| [properties-suffix](docs/rules/properties-suffix.md)                                                 | Enforce 'Props' suffix for interfaces and types in *.tsx files                                                                                                           | ✅  |    |
| [render-naming](docs/rules/render-naming.md)                                                         | Enforce 'render' prefix for variables that hold or return JSX inside React components                                                                                    | ✅  |    |
| [sort-destructuring](docs/rules/sort-destructuring.md)                                               | Enforce alphabetical sorting of destructured properties with defaults first                                                                                              | ✅  | 🔧 |
| [sort-exports](docs/rules/sort-exports.md)                                                           | Enforce a consistent ordering of export groups                                                                                                                           | ✅  | 🔧 |
| [sort-imports](docs/rules/sort-imports.md)                                                           | Enforce a consistent ordering of import declarations                                                                                                                     | ✅  | 🔧 |
| [sort-type-alphabetically](docs/rules/sort-type-alphabetically.md)                                   | Enforce alphabetical sorting of properties within required and optional groups in TypeScript interfaces and type aliases                                                 | ✅  | 🔧 |
| [sort-type-required-first](docs/rules/sort-type-required-first.md)                                   | Enforce required properties come before optional properties in TypeScript interfaces and type aliases                                                                    | ✅  | 🔧 |
| [test-filename](docs/rules/test-filename.md)                                                         | Enforce that files containing test code are named *.test.ts or *.test.tsx                                                                                                | ✅  |    |
| [type-declaration-order](docs/rules/type-declaration-order.md)                                       | Enforce that referenced types and interfaces are declared after the type that uses them                                                                                  | ✅  |    |

<!-- end auto-generated rules list -->

## Security

To report a vulnerability privately, see the [security policy](https://github.com/next-friday/eslint-plugin-friday/blob/main/.github/SECURITY.md).

## Contributing

See [CONTRIBUTING](https://github.com/next-friday/eslint-plugin-friday/blob/main/CONTRIBUTING.md) for the development workflow, commit convention, and quality gates.

## License

[MIT](https://github.com/next-friday/eslint-plugin-friday/blob/main/LICENSE) © Next Friday
