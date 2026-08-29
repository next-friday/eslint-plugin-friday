---
"eslint-plugin-friday": minor
---

Add two new rules to the base preset:

- `friday/no-js-files`: Disallows `.js` and `.jsx` file extensions with optional `allowList` for framework-mandated files
- `friday/no-lint-suppression`: Bans all lint suppression comments (`@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `eslint-disable`, `eslint-disable-line`, `eslint-disable-next-line`, `prettier-ignore`)
