# eslint-plugin-friday

## 2.0.0

### Major Changes

- [#31](https://github.com/next-friday/eslint-plugin-friday/pull/31) [`bd6a7e5`](https://github.com/next-friday/eslint-plugin-friday/commit/bd6a7e595fd057e3e61a695204c4b44eec8628ce) Thanks [@joetakara](https://github.com/joetakara)! - Rename the ESLint plugin namespace from `next-friday` to `friday`. Flat configs register the plugin under the `friday` key, generated rule IDs become `friday/<rule>`, and preset names become `friday/<preset>` such as `friday/base/recommended`. Rewrite rule overrides targeting the old IDs: `"next-friday/no-direct-date": "off"` becomes `"friday/no-direct-date": "off"`. The npm package name stays `eslint-plugin-friday` and the GitHub organization stays `next-friday`. See the migration table in the README.

## 1.1.0

### Minor Changes

- [#17](https://github.com/next-friday/eslint-plugin-friday/pull/17) [`fddb0ec`](https://github.com/next-friday/eslint-plugin-friday/commit/fddb0ec3e1fe9d7928ce280b55cbb2e70b6df7e5) Thanks [@joetakara](https://github.com/joetakara)! - Sort complete import declarations case-sensitively within each existing import subgroup and autofix them safely.

## 1.0.0

### Major Changes

- [#3](https://github.com/next-friday/eslint-plugin-friday/pull/3) [`ac470a5`](https://github.com/next-friday/eslint-plugin-friday/commit/ac470a5fee703e424ef24c44271c988660a2c364) Thanks [@joetakara](https://github.com/joetakara)! - Initial public release of `eslint-plugin-friday`, an opinionated set of 45 ESLint rules for consistent, LLM-friendly TypeScript and React code. The package ships as ESM and CommonJS with type declarations and exposes six flat-config presets: `base`, `base/recommended`, `react`, `react/recommended`, `all`, and `all/recommended`. The `/recommended` variants set their rules to error and the bare variants set them to warn.
