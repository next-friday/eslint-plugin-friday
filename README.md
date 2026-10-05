# @next-friday/eslint-plugin-friday

[![npm version](https://img.shields.io/npm/v/%40next-friday%2Feslint-plugin-friday.svg)](https://www.npmjs.com/package/@next-friday/eslint-plugin-friday) [![CI](https://github.com/next-friday/eslint-plugin-friday/actions/workflows/ci.yml/badge.svg)](https://github.com/next-friday/eslint-plugin-friday/actions/workflows/ci.yml) [![Codecov](https://codecov.io/gh/next-friday/eslint-plugin-friday/branch/main/graph/badge.svg)](https://codecov.io/gh/next-friday/eslint-plugin-friday/branch/main) [![License](https://img.shields.io/github/license/next-friday/eslint-plugin-friday.svg)](LICENSE)

Next Friday-specific ESLint rules for structural constraints generic lint stacks do not encode.

- Rules target module boundaries, React component structure, JSX layout, props shape, and identifier quality.
- Rules expose focused behavior and documented options.
- The plugin is intentionally narrow: it adds Next Friday-specific semantics instead of duplicating maintained ecosystem rules.

## Usage

Register the plugin in an ESLint Flat Config and enable the rules you need:

```js
import friday from "@next-friday/eslint-plugin-friday";

export default [
  {
    plugins: {friday},
    rules: {
      "friday/no-lazy-identifiers": "error",
    },
  },
];
```

The package exports rule implementations and their documented options.

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                                                     | Description                                                                                                                                                                        | 🔧  |
| :--------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-- |
| [component-definition-style](docs/rules/component-definition-style.md)                   | require named React function components to use function declarations                                                                                                               |     |
| [component-entrypoint](docs/rules/component-entrypoint.md)                               | require Friday component index entrypoints to expose a canonical compound API                                                                                                      |     |
| [component-module](docs/rules/component-module.md)                                       | require React component modules to contain only component definitions, component-support declarations, imports, exports, directives, and explicitly allowed framework declarations |     |
| [index-export-only](docs/rules/index-export-only.md)                                     | require index files to contain only public-surface syntax and narrowly scoped compound component API assembly                                                                      |     |
| [jsx-newline-between-elements](docs/rules/jsx-newline-between-elements.md)               | require empty lines between adjacent JSX elements, fragments, or expression containers when either is multi-line                                                                   | 🔧  |
| [jsx-no-newline-single-line-elements](docs/rules/jsx-no-newline-single-line-elements.md) | disallow empty lines between adjacent single-line JSX elements or fragments                                                                                                        | 🔧  |
| [named-props](docs/rules/named-props.md)                                                 | disallow inline intersections in the first parameter of React function components                                                                                                  |     |
| [no-lazy-identifiers](docs/rules/no-lazy-identifiers.md)                                 | disallow lazy placeholder identifiers such as repeated characters and keyboard-row runs                                                                                            |     |
| [object-curly-newline](docs/rules/object-curly-newline.md)                               | require every non-empty object literal to use multiline braces                                                                                                                     | 🔧  |
| [props-in-body](docs/rules/props-in-body.md)                                             | require React function components to accept props through a named parameter and destructure them inside the body                                                                   |     |

<!-- end auto-generated rules list -->

## Compatibility

| Surface       | Supported contract |
| :------------ | :----------------- |
| Node.js       | `^22.13.0          |     | >=24.0.0` |
| ESLint        | `^10.4.0`          |
| Module format | ESM                |

## License

[MIT](LICENSE) © Next Friday
