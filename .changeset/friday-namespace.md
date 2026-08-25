---
"eslint-plugin-friday": major
---

Rename the ESLint plugin namespace from `next-friday` to `friday`. Flat configs register the plugin under the `friday` key, generated rule IDs become `friday/<rule>`, and preset names become `friday/<preset>` such as `friday/base/recommended`. Rewrite rule overrides targeting the old IDs: `"next-friday/no-direct-date": "off"` becomes `"friday/no-direct-date": "off"`. The npm package name stays `eslint-plugin-friday` and the GitHub organization stays `next-friday`. See the migration table in the README.
