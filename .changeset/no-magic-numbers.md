---
"eslint-plugin-friday": minor
---

Add the `no-magic-numbers` rule, enabled in `friday/base/recommended`. It reports magic numbers in operands, call arguments, array indexes, default values, class field initializers, and variable reassignments, requires numeric bindings to use `const`, and always allows declarations, object values and keys, member assignments, `parseInt` radix arguments, JSX prop numbers, TypeScript enum initializers, and numbers in type space. Defaults ship strict: `ignore` of `0` and `1`, index/default/class-field reporting on, and `enforceConst` on.
