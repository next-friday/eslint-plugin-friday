---
"eslint-plugin-friday": patch
---

Sharpen `no-environment-fallback` to report only direct environment fallbacks. Conditional expressions that merely test an environment variable are no longer reported, and `new.target.*` is no longer mistaken for `import.meta.env`. Newly detected fallbacks: destructuring defaults from `process.env` or `import.meta.env`, logical assignments `||=` and `??=`, and TypeScript-wrapped operands such as `as`, `satisfies`, non-null, and angle-bracket assertions. The diagnostic message now describes the enforced policy without claiming startup validation.
