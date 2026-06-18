import rule from "../../src/rules/sort-destructuring.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("sort-destructuring", rule, {
  valid: [
    {
      name: "computed key is ignored when sorting",
      code: "const { [key]: value, a } = obj;",
    },
    {
      name: "alphabetically sorted without defaults",
      code: "const { a, b, c, d } = foo;",
    },
    {
      name: "single property",
      code: "const { a } = foo;",
    },
    {
      name: "two properties sorted",
      code: "const { a, b } = foo;",
    },
    {
      name: "defaults first (sorted alphabetically), then non-defaults",
      code: 'const { a = "alpha", b = "beta", c, d } = foo;',
    },
    {
      name: "number defaults first (sorted alphabetically), then non-defaults",
      code: "const { a = 1, b = 2, c, d } = foo;",
    },
    {
      name: "boolean defaults first (sorted alphabetically), then non-defaults",
      code: "const { a = true, b = false, c, d } = foo;",
    },
    {
      name: "object defaults first (sorted alphabetically), then non-defaults",
      code: "const { a = {}, b = [], c, d } = foo;",
    },
    {
      name: "with rest element at end",
      code: "const { a, b, ...rest } = foo;",
    },
    {
      name: "only rest element",
      code: "const { ...rest } = foo;",
    },
    {
      name: "all defaults sorted alphabetically",
      code: 'const { a = "test", b = "value", c = 1, d = 2 } = foo;',
    },
    {
      name: "defaults alphabetically sorted, then non-defaults",
      code: "const { autoplay = false, duration = 5000, totalSlides } = options;",
    },
    {
      name: "mixed default types sorted alphabetically, then non-defaults alphabetically",
      code: 'const { active = true, age = 0, data = {}, name = "default", x, y, z } = foo;',
    },
    {
      name: "defaults first alphabetically (d, e, f), then non-defaults alphabetically (a, b, c)",
      code: 'const { d = "string", e = 0, f = true, a, b, c } = foo;',
    },
    {
      name: "non-destructuring declarator is ignored",
      code: "const x = foo;",
    },
    {
      name: "array destructuring is ignored",
      code: "const [b, a] = foo;",
    },
    {
      name: "string-literal key skipped, single identifier remains",
      code: 'const { "x-y": a, b } = foo;',
    },
  ],
  invalid: [
    {
      name: "skips autofix when a comment is present",
      code: `const {
  b,
  // the a property
  a,
} = foo;`,
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "skips autofix when an inline comment precedes a separator",
      code: "const { b /* keep with b */, a } = foo;",
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "not sorted alphabetically",
      code: "const { d, b, a, c } = foo;",
      output: "const { a, b, c, d } = foo;",
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "completely unsorted",
      code: "const { z, a, m } = foo;",
      output: "const { a, m, z } = foo;",
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "two properties reversed",
      code: "const { b, a } = foo;",
      output: "const { a, b } = foo;",
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "default in middle (should be first)",
      code: 'const { a, b, d = "string", c } = foo;',
      output: 'const { d = "string", a, b, c } = foo;',
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "non-default before defaults",
      code: 'const { a, d = "string", e = 0 } = foo;',
      output: 'const { d = "string", e = 0, a } = foo;',
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "defaults not sorted alphabetically (e before d)",
      code: 'const { e = 0, d = "string", a, b } = foo;',
      output: 'const { d = "string", e = 0, a, b } = foo;',
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "defaults not sorted alphabetically (b before a)",
      code: 'const { b = "beta", a = "alpha", c } = foo;',
      output: 'const { a = "alpha", b = "beta", c } = foo;',
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "defaults not sorted alphabetically",
      code: "const { b = 2, a = 1, c } = foo;",
      output: "const { a = 1, b = 2, c } = foo;",
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "completely reversed order",
      code: "const { z, y, x, a, b, c } = foo;",
      output: "const { a, b, c, x, y, z } = foo;",
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "non-defaults before defaults and not sorted",
      code: 'const { c, a, name = "default", age = 0 } = foo;',
      output: 'const { age = 0, name = "default", a, c } = foo;',
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "defaults not sorted alphabetically (duration before autoplay)",
      code: "const { duration = 5000, autoplay = false, totalSlides } = options;",
      output:
        "const { autoplay = false, duration = 5000, totalSlides } = options;",
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "defaults not sorted alphabetically (name, age, active, data should be active, age, data, name)",
      code: 'const { name = "default", age = 0, active = true, data = {}, x, y, z } = foo;',
      output:
        'const { active = true, age = 0, data = {}, name = "default", x, y, z } = foo;',
      errors: [{ messageId: "unsortedDestructuring" }],
    },
    {
      name: "string-literal key skipped, remaining identifiers unsorted",
      code: 'const { "x-y": z, b, a } = foo;',
      output: 'const { "x-y": z, a, b } = foo;',
      errors: [{ messageId: "unsortedDestructuring" }],
    },
  ],
});
