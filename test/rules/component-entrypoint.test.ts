import {RuleTester} from "eslint";
import {parser as typescriptParser} from "typescript-eslint";
import {describe, it} from "vitest";

import {componentEntrypoint} from "../../src/rules/component-entrypoint";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      sourceType: "module",
    },
  },
});

const filename = "index.ts";

ruleTester.run("component-entrypoint", componentEntrypoint, {
  valid: [
    {
      code: [
        'import {ButtonRoot} from "./button";',
        "export const Button = Object.assign(ButtonRoot, {Root: ButtonRoot});",
      ].join("\n"),
      filename,
      name: "root-only component entrypoint",
    },
    {
      code: [
        'import {AccordionBody, AccordionItem, AccordionRoot} from "./accordion";',
        "export const Accordion = Object.assign(AccordionRoot, {",
        "  Body: AccordionBody,",
        "  Item: AccordionItem,",
        "  Root: AccordionRoot,",
        "});",
      ].join("\n"),
      filename,
      name: "compound component entrypoint",
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
      filename,
      name: "typed compound bridge for generic call signatures",
    },
    {
      code: [
        'import {ToastQueue} from "./toast-queue";',
        'import {ToastRoot} from "./toast";',
        "export const Toast = Object.assign(ToastRoot, {",
        "  Queue: ToastQueue,",
        "  Root: ToastRoot,",
        "});",
      ].join("\n"),
      filename,
      name: "legacy ignoreMembers option remains accepted",
      options: [{ignoreMembers: ["Queue"]}],
    },
    {
      code: [
        'import {ButtonRoot} from "./button";',
        'export const Button = Object.assign(ButtonRoot, {"Root": ButtonRoot});',
      ].join("\n"),
      filename,
      name: "string-literal static keys are supported",
    },
    {
      code: [
        'import {ButtonRoot} from "./button";',
        "declare const key: string;",
        "let IgnoredCompound = Object.assign(ButtonRoot, {Root: ButtonRoot});",
        "const WrongShapeCompound = Object.assign(ButtonRoot, ButtonRoot);",
        "const MethodCompound = Object.assign(ButtonRoot, {Root() { return ButtonRoot; }});",
        "const ComputedCompound = Object.assign(ButtonRoot, {[key]: ButtonRoot});",
        "export const Button = Object.assign(ButtonRoot, {Root: ButtonRoot});",
      ].join("\n"),
      filename,
      name: "unrelated malformed local compound candidates are ignored",
    },
    {
      code: [
        'import {ButtonRoot} from "./button";',
        "declare const source: {Button: unknown};",
        "declare const value: unknown;",
        "export const {Button} = source;",
        "export const button = ButtonRoot;",
        "export const Version = 1;",
        "export const Label = value as string;",
      ].join("\n"),
      filename,
      name: "non-component runtime exports are ignored by the component contract rule",
    },
    {
      code: "export const Header = HeaderRoot;\n",
      filename: "header.ts",
      name: "does not apply outside index files",
    },
  ],
  invalid: [
    {
      code: ['import {HeaderRoot} from "./header";', "export const Header = HeaderRoot;"].join(
        "\n",
      ),
      errors: [{messageId: "componentAssembly"}],
      filename,
      name: "direct root alias is not canonical assembly",
    },
    {
      code: ['import {OtherRoot} from "./other";', "export const Header = OtherRoot;"].join("\n"),
      errors: [{messageId: "componentAssembly"}],
      filename,
      name: "direct root alias must match the exported component name",
    },
    {
      code: [
        'import {ButtonRoot} from "./button";',
        "export const Button = Object.assign(ButtonRoot, {});",
      ].join("\n"),
      errors: [{messageId: "componentAssembly"}],
      filename,
      name: "compound assembly must expose Root",
    },
    {
      code: [
        'import {ButtonRoot, OtherRoot} from "./button";',
        "export const Button = Object.assign(OtherRoot, {Root: OtherRoot});",
      ].join("\n"),
      errors: [{messageId: "componentAssembly"}],
      filename,
      name: "root binding must match exported component name",
    },
  ],
});
