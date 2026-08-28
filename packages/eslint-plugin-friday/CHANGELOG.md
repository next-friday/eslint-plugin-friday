# eslint-plugin-friday

## 2.1.0

### Minor Changes

- [#38](https://github.com/next-friday/eslint-plugin-friday/pull/38) [`c943179`](https://github.com/next-friday/eslint-plugin-friday/commit/c943179246918c2376fad12a579ce53843b1111c) Thanks [@joetakara](https://github.com/joetakara)! - Add the `no-magic-numbers` rule, enabled in `friday/base/recommended`. It reports magic numbers in operands, call arguments, array indexes, default values, class field initializers, and variable reassignments, requires numeric bindings to use `const`, and always allows declarations, object values and keys, member assignments, `parseInt` radix arguments, JSX prop numbers, TypeScript enum initializers, and numbers in type space. Defaults ship strict: `ignore` of `0` and `1`, index/default/class-field reporting on, and `enforceConst` on.

## 2.0.1

### Patch Changes

- [#34](https://github.com/next-friday/eslint-plugin-friday/pull/34) [`8494513`](https://github.com/next-friday/eslint-plugin-friday/commit/8494513760270ed8347b1b53c6b8abfa7379e932) Thanks [@joetakara](https://github.com/joetakara)! - Sharpen `no-environment-fallback` to report only direct environment fallbacks. Conditional expressions that merely test an environment variable are no longer reported, and `new.target.*` is no longer mistaken for `import.meta.env`. Newly detected fallbacks: destructuring defaults from `process.env` or `import.meta.env`, logical assignments `||=` and `??=`, and TypeScript-wrapped operands such as `as`, `satisfies`, non-null, and angle-bracket assertions. The diagnostic message now describes the enforced policy without claiming startup validation.

## 2.0.0

### Major Changes

- [#31](https://github.com/next-friday/eslint-plugin-friday/pull/31) [`bd6a7e5`](https://github.com/next-friday/eslint-plugin-friday/commit/bd6a7e595fd057e3e61a695204c4b44eec8628ce) Thanks [@joetakara](https://github.com/joetakara)! - Rename the ESLint plugin namespace from `next-friday` to `friday`. Flat configs register the plugin under the `friday` key, generated rule IDs become `friday/<rule>`, and preset names become `friday/<preset>` such as `friday/base/recommended`. Rewrite rule overrides targeting the old IDs: `"next-friday/no-direct-date": "off"` becomes `"friday/no-direct-date": "off"`. The npm package name stays `eslint-plugin-friday` and the GitHub organization stays `next-friday`. See the migration table in the README.

## 1.1.0

### Minor Changes

- [#17](https://github.com/next-friday/eslint-plugin-friday/pull/17) [`fddb0ec`](https://github.com/next-friday/eslint-plugin-friday/commit/fddb0ec3e1fe9d7928ce280b55cbb2e70b6df7e5) Thanks [@joetakara](https://github.com/joetakara)! - Sort complete import declarations case-sensitively within each existing import subgroup and autofix them safely.

## 1.0.0

### Major Changes

- [#3](https://github.com/next-friday/eslint-plugin-friday/pull/3) [`ac470a5`](https://github.com/next-friday/eslint-plugin-friday/commit/ac470a5fee703e424ef24c44271c988660a2c364) Thanks [@joetakara](https://github.com/joetakara)! - Initial public release of `eslint-plugin-friday`, an opinionated set of 45 ESLint rules for consistent, LLM-friendly TypeScript and React code. The package ships as ESM and CommonJS with type declarations and exposes six flat-config presets: `base`, `base/recommended`, `react`, `react/recommended`, `all`, and `all/recommended`. The `/recommended` variants set their rules to error and the bare variants set them to warn.
