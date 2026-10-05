---
"@next-friday/eslint-plugin-friday": patch
---

Stop `friday/component-entrypoint` from requiring same-name `ComponentProps` type aliases. The rule now validates only canonical component compound assembly while retaining `ignoreMembers` as a no-op compatibility option.
