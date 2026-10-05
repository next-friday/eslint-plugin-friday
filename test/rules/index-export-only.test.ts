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
  {
    code: [
      'import {AccordionBody, AccordionRoot} from "./accordion";',
      "export const Accordion = Object.assign(AccordionRoot, {",
      "  Body: AccordionBody,",
      "  Root: AccordionRoot,",
      "});",
    ].join("\n"),
    name: "compound component public API assembly",
  },
  {
    code: [
      'import {CalendarCell, CalendarRoot} from "./calendar";',
      "type CalendarComponent = (props: unknown) => unknown;",
      "const CalendarCompound = Object.assign(CalendarRoot, {",
      "  Cell: CalendarCell,",
      "  Root: CalendarRoot,",
      "});",
      "export const Calendar = CalendarCompound as CalendarComponent & typeof CalendarCompound;",
    ].join("\n"),
    name: "typed compound bridge for generic call signatures",
  },
  {
    code: ['import {HeaderRoot} from "./header";', "export const Header = HeaderRoot;"].join("\n"),
    name: "PascalCase public alias of an imported runtime binding",
  },
  {
    code: [
      'import {CalendarCell, CalendarGrid} from "./calendar";',
      "export const CalendarYearPicker = {",
      "  Cell: CalendarCell,",
      "  Grid: CalendarGrid,",
      "};",
    ].join("\n"),
    name: "PascalCase static public namespace of imported runtime bindings",
  },
];

const REPORTED_CASES = [
  {
    code: "export const value = 1;\n",
    name: "runtime constant",
  },
  {
    code: "import Alias = Namespace.Member;\n",
    name: "TypeScript entity-name import alias",
  },
  {
    code: "export import Alias = Namespace.Member;\n",
    name: "exported TypeScript entity-name import alias",
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
  {
    code: [
      'import {AccordionRoot} from "./accordion";',
      "export const config = Object.assign({}, {Root: AccordionRoot});",
    ].join("\n"),
    name: "Object.assign with a non-imported base",
  },
  {
    code: [
      'import {AccordionItem, AccordionRoot} from "./accordion";',
      "export const Accordion = Object.assign(AccordionRoot, {",
      "  Item: props => AccordionItem(props),",
      "  Root: AccordionRoot,",
      "});",
    ].join("\n"),
    name: "compound assembly with runtime callback",
  },
  {
    code: [
      'import {AccordionRoot} from "./accordion";',
      "const AccordionCompound = Object.assign(AccordionRoot, {Root: AccordionRoot});",
    ].join("\n"),
    name: "unexported local compound assembly",
  },
  {
    code: ['import {value} from "./value";', "export const config = value;"].join("\n"),
    name: "lowercase runtime alias is not component public assembly",
  },
  {
    code: [
      'import {value} from "./value";',
      "export const Config = {value, computed: build()};",
    ].join("\n"),
    name: "static namespace with computed runtime value",
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
  invalid: [
    ...REPORTED_CASES.map(({code, name}) => ({
      code,
      errors: [{messageId: "indexExportOnly"}],
      filename,
      name,
    })),
    {
      code: [
        'import {CalendarRoot} from "./calendar";',
        "type Component = (props: unknown) => unknown;",
        "const OtherCompound = Object.assign(CalendarRoot, {Root: CalendarRoot});",
        "export const Other = OtherCompound as Component & typeof OtherCompound;",
        "export const Calendar = OtherCompound as Component & typeof OtherCompound;",
      ].join("\n"),
      errors: [{messageId: "indexExportOnly"}],
      filename,
      name: "typed bridge with a mismatched export name",
    },
    {
      code: [
        'import {CalendarRoot} from "./calendar";',
        "type CalendarComponent = (props: unknown) => unknown;",
        "const CalendarCompound = CalendarRoot;",
        "export const Calendar = CalendarCompound as CalendarComponent & typeof CalendarCompound;",
      ].join("\n"),
      errors: [{messageId: "indexExportOnly"}, {messageId: "indexExportOnly"}],
      filename,
      name: "typed bridge with a non-assembly local value",
    },
    {
      code: [
        'import type {Root} from "./root";',
        "export const Accordion = Object.assign(Root, {Root});",
      ].join("\n"),
      errors: [{messageId: "indexExportOnly"}],
      filename,
      name: "compound assembly using a type-only import",
    },
  ],
});
