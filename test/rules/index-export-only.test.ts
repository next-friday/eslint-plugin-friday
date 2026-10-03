import {RuleTester} from "eslint";
import {parser as typescriptParser} from "typescript-eslint";
import {describe, it} from "vitest";

import {indexExportOnly} from "../../src/rules/index-export-only";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {parser: typescriptParser},
});
const filename = "index.ts";

const ALLOWED_CASES = [
  {
    code: 'export {value} from "./value";\n',
    name: "barrel export list",
  },
  {
    code: 'export * from "./value";\n',
    name: "star re-export",
  },
  {
    code: 'import {value} from "./value";\n',
    name: "import declaration",
  },
  {
    code: 'import value = require("./value");\n',
    name: "TypeScript import equals",
  },
  {
    code: "export interface Value {}\n",
    name: "exported interface",
  },
  {
    code: "export type Value = string;\n",
    name: "exported type alias",
  },
  {
    code: "interface Value {}\n",
    name: "local interface",
  },
  {
    code: "type Value = string;\n",
    name: "local type alias",
  },
  {
    code: 'export type {Value} from "./value";\n',
    name: "type-only export list",
  },
  {
    code: 'import Component from "./component";\nexport default Component;\n',
    name: "default export of an identifier",
  },
  {
    code: '"use strict";\n',
    name: "directive statement",
  },
];

const REPORTED_CASES = [
  {
    code: "export const value = 1;\n",
    name: "runtime constant",
  },
  {
    code: "export function value() {}\n",
    name: "runtime function",
  },
  {
    code: "export default function value() {}\n",
    name: "inline default function",
  },
  {
    code: "export default 1;\n",
    name: "default export literal",
  },
  {
    code: "const value = 1;\n",
    name: "local implementation",
  },
  {
    code: "value++;\n",
    name: "non-directive expression statement",
  },
];

ruleTester.run("index-export-only", indexExportOnly, {
  valid: [
    ...ALLOWED_CASES.map(({code, name}) => ({
      code,
      filename,
      name,
    })),
    {
      code: "export const value = 1;\n",
      filename: "value.ts",
      name: "does not apply to non-index files",
    },
  ],
  invalid: REPORTED_CASES.map(({code, name}) => ({
    code,
    errors: [{messageId: "indexExportOnly"}],
    filename,
    name,
  })),
});
