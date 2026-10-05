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
        'import type {ComponentProps} from "react";',
        'import {ButtonRoot} from "./button";',
        "export const Button = Object.assign(ButtonRoot, {Root: ButtonRoot});",
        "export type Button = {",
        "  Props: ComponentProps<typeof ButtonRoot>;",
        "  RootProps: ComponentProps<typeof ButtonRoot>;",
        "};",
      ].join("\n"),
      filename,
      name: "root-only component entrypoint",
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {AccordionBody, AccordionItem, AccordionRoot} from "./accordion";',
        "export const Accordion = Object.assign(AccordionRoot, {",
        "  Body: AccordionBody,",
        "  Item: AccordionItem,",
        "  Root: AccordionRoot,",
        "});",
        "export type Accordion = {",
        "  BodyProps: ComponentProps<typeof AccordionBody>;",
        "  ItemProps: ComponentProps<typeof AccordionItem>;",
        "  Props: ComponentProps<typeof AccordionRoot>;",
        "  RootProps: ComponentProps<typeof AccordionRoot>;",
        "};",
      ].join("\n"),
      filename,
      name: "compound component entrypoint",
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {DropdownMenu, DropdownRoot} from "./dropdown";',
        "export const Dropdown = Object.assign(DropdownRoot, {",
        "  Menu: DropdownMenu,",
        "  Root: DropdownRoot,",
        "});",
        "export type Dropdown<T extends object = object> = {",
        "  MenuProps: ComponentProps<typeof DropdownMenu<T>>;",
        "  Props: ComponentProps<typeof DropdownRoot>;",
        "  RootProps: ComponentProps<typeof DropdownRoot>;",
        "};",
      ].join("\n"),
      filename,
      name: "generic component props aliases",
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {CalendarCell, CalendarRoot} from "./calendar";',
        "type CalendarComponent = (props: unknown) => unknown;",
        "const CalendarCompound = Object.assign(CalendarRoot, {",
        "  Cell: CalendarCell,",
        "  Root: CalendarRoot,",
        "});",
        "export const Calendar = CalendarCompound as CalendarComponent & typeof CalendarCompound;",
        "export type Calendar = {",
        "  CellProps: ComponentProps<typeof CalendarCell>;",
        "  Props: ComponentProps<typeof CalendarRoot>;",
        "  RootProps: ComponentProps<typeof CalendarRoot>;",
        "};",
      ].join("\n"),
      filename,
      name: "typed compound bridge for generic call signatures",
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {ToastQueue} from "./toast-queue";',
        'import {ToastRoot} from "./toast";',
        "export const Toast = Object.assign(ToastRoot, {",
        "  Queue: ToastQueue,",
        "  Root: ToastRoot,",
        "});",
        "export type Toast = {",
        "  Props: ComponentProps<typeof ToastRoot>;",
        "  RootProps: ComponentProps<typeof ToastRoot>;",
        "};",
      ].join("\n"),
      filename,
      name: "ignored static utility does not require ComponentProps alias",
      options: [{ignoreMembers: ["Queue"]}],
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {ButtonRoot} from "./button";',
        'export const Button = Object.assign(ButtonRoot, {"Root": ButtonRoot});',
        "export type Button = {",
        "  Props: ComponentProps<typeof ButtonRoot>;",
        "  RootProps: ComponentProps<typeof ButtonRoot>;",
        "};",
      ].join("\n"),
      filename,
      name: "string-literal static keys are supported",
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {ButtonRoot} from "./button";',
        "declare const key: string;",
        "let IgnoredCompound = Object.assign(ButtonRoot, {Root: ButtonRoot});",
        "const WrongShapeCompound = Object.assign(ButtonRoot, ButtonRoot);",
        "const MethodCompound = Object.assign(ButtonRoot, {Root() { return ButtonRoot; }});",
        "const ComputedCompound = Object.assign(ButtonRoot, {[key]: ButtonRoot});",
        "export const Button = Object.assign(ButtonRoot, {Root: ButtonRoot});",
        "export type Button = {",
        "  Props: ComponentProps<typeof ButtonRoot>;",
        "  RootProps: ComponentProps<typeof ButtonRoot>;",
        "};",
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
    {
      code: [
        'import {ButtonRoot} from "./button";',
        "export const Button = Object.assign(ButtonRoot, {Root: ButtonRoot});",
      ].join("\n"),
      errors: [{messageId: "componentTypeContract"}],
      filename,
      name: "component namespace type is required",
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {ButtonRoot} from "./button";',
        "export const Button = Object.assign(ButtonRoot, {Root: ButtonRoot});",
        "export type Button = {Props: ComponentProps<typeof ButtonRoot>};",
      ].join("\n"),
      errors: [{messageId: "componentTypeContract"}],
      filename,
      name: "RootProps alias is required",
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {AccordionBody, AccordionRoot} from "./accordion";',
        "export const Accordion = Object.assign(AccordionRoot, {",
        "  Body: AccordionBody,",
        "  Root: AccordionRoot,",
        "});",
        "export type Accordion = {",
        "  Props: ComponentProps<typeof AccordionRoot>;",
        "  RootProps: ComponentProps<typeof AccordionRoot>;",
        "};",
      ].join("\n"),
      errors: [{messageId: "componentTypeContract"}],
      filename,
      name: "static member props alias is required",
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {AccordionBody, AccordionRoot} from "./accordion";',
        "export const Accordion = Object.assign(AccordionRoot, {",
        "  Body: AccordionBody,",
        "  Root: AccordionRoot,",
        "});",
        "export type Accordion = {",
        "  BodyProps: ComponentProps<typeof AccordionRoot>;",
        "  Props: ComponentProps<typeof AccordionRoot>;",
        "  RootProps: ComponentProps<typeof AccordionRoot>;",
        "};",
      ].join("\n"),
      errors: [{messageId: "componentTypeContract"}],
      filename,
      name: "static member props alias must target matching binding",
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {ButtonRoot} from "./button";',
        "export const Button = Object.assign(ButtonRoot, {Root: ButtonRoot});",
        "export type Button = {",
        "  Props: ComponentProps<typeof ButtonRoot>;",
        "  RootProps: string;",
        "};",
      ].join("\n"),
      errors: [{messageId: "componentTypeContract"}],
      filename,
      name: "component props aliases must use ComponentProps",
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {ButtonRoot} from "./button";',
        "export const Button = Object.assign(ButtonRoot, {Root: ButtonRoot});",
        "export type Button = {",
        "  Props: ComponentProps<typeof ButtonRoot>;",
        "  RootProps: ComponentProps<ButtonRoot>;",
        "};",
      ].join("\n"),
      errors: [{messageId: "componentTypeContract"}],
      filename,
      name: "component props aliases must query typeof the target binding",
    },
    {
      code: [
        'import type {ComponentProps} from "react";',
        'import {ButtonRoot} from "./button";',
        "export const Button = Object.assign(ButtonRoot, {Root: ButtonRoot});",
        "export type Button = {",
        '  "Props": ComponentProps<typeof ButtonRoot>;',
        '  "RootProps": ComponentProps<typeof ButtonRoot>;',
        "};",
      ].join("\n"),
      errors: [{messageId: "componentTypeContract"}],
      filename,
      name: "component props namespace members use identifier keys",
    },
  ],
});
