/* eslint-disable @typescript-eslint/ban-ts-comment */
import rule from "../../src/rules/no-lint-suppression.js";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

ruleTester.run("no-lint-suppression", rule, {
  valid: [
    {
      name: "should allow regular comments",
      code: `// This is a regular comment
const x = 1;`,
    },
    {
      name: "should allow block comments without suppression",
      code: `/* This is a block comment */
const x = 1;`,
    },
    {
      name: "should allow comments with similar text in strings",
      code: `const str = "// @ts-ignore this is a string";
const x = 1;`,
    },
    {
      name: "should allow comments with similar text in template literals",
      code: `const str = \`// @ts-ignore this is a template\`;
const x = 1;`,
    },
    {
      name: "should allow @ts-ignore in string literal",
      code: `const message = "@ts-ignore is a directive";
const x = 1;`,
    },
    {
      name: "should allow explanation comments",
      code: `// explaining a non-obvious algorithm is fine
const total = price * VAT_RATE;`,
    },
    {
      name: "should allow ordinary block comments",
      code: `/* ordinary block comments are fine */
const x = 1;`,
    },
    {
      name: "should allow jsdoc comments",
      code: `/**
 * This is a JSDoc comment
 * @param {string} name - The name
 */
function greet(name) {}`,
    },
  ],
  invalid: [
    {
      name: "should disallow @ts-ignore on own line",
      code: `// @ts-ignore
const value = risky();`,
      errors: [{ messageId: "tsIgnore", line: 1, column: 4 }],
    },
    {
      name: "should disallow @ts-expect-error on own line",
      code: `// @ts-expect-error
const other = riskier();`,
      errors: [{ messageId: "tsExpectError", line: 1, column: 4 }],
    },
    {
      name: "should disallow @ts-nocheck on own line",
      code: `// @ts-nocheck
const x = 1;`,
      errors: [{ messageId: "tsNocheck", line: 1, column: 4 }],
    },
    {
      name: "should disallow eslint-disable block comment",
      code: `/* eslint-disable no-unused-vars */
const x = 1;`,
      output: ` 
const x = 1;`,
      errors: [
        // @ts-expect-error
        { message: /Unused eslint-disable directive/ },
        { messageId: "eslintDisable", line: 1, column: 4 },
      ],
    },
    {
      name: "should disallow eslint-disable-line trailing comment",
      code: `doWork(); // eslint-disable-line no-unused-vars`,
      output: `doWork();  `,
      errors: [
        // @ts-expect-error
        { message: /Unused eslint-disable directive/ },
        { messageId: "eslintDisableLine", line: 1, column: 14 },
      ],
    },
    {
      name: "should disallow eslint-disable-next-line comment",
      code: `// eslint-disable-next-line no-unused-vars
const anything = 1;`,
      output: ` 
const anything = 1;`,
      errors: [
        // @ts-expect-error
        { message: /Unused eslint-disable directive/ },
        { messageId: "eslintDisableNextLine", line: 1, column: 4 },
      ],
    },
    {
      name: "should disallow prettier-ignore comment",
      code: `// prettier-ignore
const matrix = [1, 2];`,
      errors: [{ messageId: "prettierIgnore", line: 1, column: 4 }],
    },
    {
      name: "should disallow suppression inside larger block comment",
      code: `/* some comment eslint-disable no-unused-vars more comment */
const x = 1;`,
      errors: [{ messageId: "eslintDisable", line: 1, column: 17 }],
    },
    {
      name: "should disallow @ts-ignore inside block comment",
      code: `/* @ts-ignore some comment */
const x = 1;`,
      errors: [{ messageId: "tsIgnore", line: 1, column: 4 }],
    },
    {
      name: "should disallow directive on first line of file",
      code: `// @ts-ignore
export const x = 1;`,
      errors: [{ messageId: "tsIgnore", line: 1, column: 4 }],
    },
    {
      name: "should report multiple directives in one file",
      code: `// @ts-ignore
const a = 1;
// @ts-expect-error
const b = 2;`,
      errors: [
        { messageId: "tsIgnore", line: 1, column: 4 },
        { messageId: "tsExpectError", line: 3, column: 4 },
      ],
    },
    {
      name: "should disallow eslint-disable with specific rule",
      code: `/* eslint-disable no-unused-vars */
const x = 1;`,
      output: ` 
const x = 1;`,
      errors: [
        // @ts-expect-error
        { message: /Unused eslint-disable directive/ },
        { messageId: "eslintDisable", line: 1, column: 4 },
      ],
    },
    {
      name: "should disallow eslint-disable-next-line with specific rule",
      code: `// eslint-disable-next-line no-unused-vars
const x = 1;`,
      output: ` 
const x = 1;`,
      errors: [
        // @ts-expect-error
        { message: /Unused eslint-disable directive/ },
        { messageId: "eslintDisableNextLine", line: 1, column: 4 },
      ],
    },
    {
      name: "should disallow eslint-disable-line with specific rule",
      code: `const x = 1; // eslint-disable-line no-unused-vars`,
      output: `const x = 1;  `,
      errors: [
        // @ts-expect-error
        { message: /Unused eslint-disable directive/ },
        { messageId: "eslintDisableLine", line: 1, column: 17 },
      ],
    },
  ],
});
