import rule from "../../src/rules/no-magic-numbers.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

const jsxRuleTester = createRuleTester(true);

const presetOptions = {
  ignore: [0, 1],
  ignoreArrayIndexes: false,
  ignoreDefaultValues: false,
  ignoreClassFieldInitialValues: false,
  enforceConst: true,
};

ruleTester.run("no-magic-numbers", rule, {
  valid: [
    {
      name: "allows zero and one everywhere",
      code: `const first = data[0];
const flag = value === 1;
setTimeout(start, 0);
setTimeout(start, +1);
if (items.length > 1) {}`,
    },
    {
      name: "allows declaring named constants",
      code: `const timeoutMs = 3000;
const taxRate = 0.25;
export const maxRetries = 3;`,
    },
    {
      name: "allows object property values",
      code: `const config = { retries: 3 };
const rank = { 2: "silver" };`,
    },
    {
      name: "allows assignments to members",
      code: `this.retries = 5;
settings.timeout = 30_000;
position.x += 16;`,
    },
    {
      name: "allows parse int radix arguments",
      code: `parseInt(raw, 8);
Number.parseInt(raw, 16);`,
    },
    {
      name: "allows TypeScript enum member initializers",
      code: `enum Direction {
  Up = 1,
  Down = -2,
}`,
    },
    {
      name: "allows numbers in type space",
      code: `type Mode = 2 | 3;
type Entry = Settings[4];
interface Props {
  size: 42;
}`,
    },
    {
      name: "allows negative zero",
      code: `const offset = -0;`,
    },
    {
      name: "allows ignored bigint literals",
      code: `queue.wait(1n);`,
      options: [{ ...presetOptions, ignore: ["1n"] }],
    },
    {
      name: "allows array indexes when configured",
      code: `const third = data[7];`,
      options: [{ ...presetOptions, ignoreArrayIndexes: true }],
    },
    {
      name: "allows default values when configured",
      code: `function resize(height = 768) {}`,
      options: [{ ...presetOptions, ignoreDefaultValues: true }],
    },
    {
      name: "allows class field initial values when configured",
      code: `class Meter {
  capacity = 3600;
}`,
      options: [{ ...presetOptions, ignoreClassFieldInitialValues: true }],
    },
    {
      name: "allows additionally ignored values",
      code: `const ratio = scale * 3;`,
      options: [{ ...presetOptions, ignore: [0, 1, 3] }],
    },
    {
      name: "allows let declarations when const enforcement is disabled",
      code: `let seconds = 60;`,
      options: [{ ...presetOptions, enforceConst: false }],
    },
  ],
  invalid: [
    {
      name: "reports a magic number operand",
      code: `const total = price * 1.21;`,
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports a magic number argument",
      code: `setTimeout(start, 3000);`,
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports a magic array index",
      code: `const third = data[2];`,
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports a default parameter value",
      code: `function resize(height = 768) {}`,
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports a destructuring default value",
      code: `const { width = 100 } = size;`,
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports class field initial values",
      code: `class Meter {
  capacity = 60 * 60;
}`,
      errors: [{ messageId: "noMagicNumber" }, { messageId: "noMagicNumber" }],
    },
    {
      name: "reports let constant declarations",
      code: `let seconds = 60;`,
      errors: [{ messageId: "requireConst" }],
    },
    {
      name: "reports var constant declarations",
      code: `var attempts = 5;`,
      errors: [{ messageId: "requireConst" }],
    },
    {
      name: "reports reassignment of a variable",
      code: `let position = 0;
position = 16;`,
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports negative literals outside declarations",
      code: `move(-2);`,
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports returned magic numbers",
      code: `function notFound() {
  return 404;
}`,
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports zero and one when not ignored",
      code: `setTimeout(start, 1);`,
      options: [{ ...presetOptions, ignore: [] }],
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports unignored bigint literals",
      code: `queue.wait(100n);`,
      options: [{ ...presetOptions }],
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports negative indexes beyond the array range",
      code: `send(data[-2]);`,
      options: [{ ...presetOptions, ignoreArrayIndexes: true }],
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports fractional indexes beyond the array range",
      code: `send(data[2.5]);`,
      options: [{ ...presetOptions, ignoreArrayIndexes: true }],
      errors: [{ messageId: "noMagicNumber" }],
    },
    {
      name: "reports non-index operands when array indexes are ignored",
      code: `const total = price * 4;`,
      options: [{ ...presetOptions, ignoreArrayIndexes: true }],
      errors: [{ messageId: "noMagicNumber" }],
    },
  ],
});

jsxRuleTester.run("no-magic-numbers", rule, {
  valid: [
    {
      name: "allows numbers in JSX props",
      code: `const input = <input maxLength={10} />;`,
    },
  ],
  invalid: [],
});
