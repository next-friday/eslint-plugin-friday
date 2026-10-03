import {RuleTester} from "eslint";
import {parser as typescriptParser} from "typescript-eslint";
import {describe, it} from "vitest";

import {componentModule} from "../../src/rules/component-module";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      ecmaFeatures: {jsx: true},
      sourceType: "module",
    },
  },
});

const DEFAULT_PAGE = "export default function Page() { return <main />; }";

const PROPERTIES_COMPONENT =
  "export function Component(properties: Properties) { return <button>{properties.label}</button>; }";

const SIMPLE_COMPONENT = "export function Component() { return <div />; }";
const jsxFixture = "component.jsx";
const tsxFixture = "component.tsx";

type BehaviorCase = {
  filePath?: string;
  name: string;
  source: string;
};

const ALLOW_CASES: BehaviorCase[] = [
  {
    name: "imports and one function component",
    source: [
      'import {Fragment} from "react";',
      "export function Component() { return <Fragment />; }",
    ].join("\n"),
  },
  {
    name: "multiple function components",
    source: [
      "export function Component1() { return <div />; }",
      "export function Component2() { return <span />; }",
    ].join("\n"),
  },
  {
    name: "client directive and component",
    source: ['"use client";', SIMPLE_COMPONENT].join("\n"),
  },
  {
    name: "server directive and component",
    source: ['"use server";', SIMPLE_COMPONENT].join("\n"),
  },
  {
    name: "default-exported function component",
    source: "export default function Component() { return <div />; }",
  },
  {
    name: "bare export for a local component",
    source: ["function Component() { return <div />; }", "export {Component};"].join("\n"),
  },
  {
    name: "arrow function component",
    source: "export const Component = () => <div />;",
  },
  {
    name: "memo-wrapped function component",
    source: ['import {memo} from "react";', "export const Component = memo(() => <div />);"].join(
      "\n",
    ),
  },
  {
    name: "forwardRef-wrapped function component",
    source: [
      'import {forwardRef} from "react";',
      "export const Component = forwardRef((_properties, reference) => <div ref={reference as never} />);",
    ].join("\n"),
  },
  {
    name: "multiple components in one variable declaration",
    source: "export const Component1 = () => <div />, Component2 = () => <span />;",
  },
  {
    filePath: jsxFixture,
    source: SIMPLE_COMPONENT,
    name: "plain JSX component module",
  },
  {
    name: "local helper inside a component body",
    source: [
      "export function Component() {",
      "  const format = (value: string) => value.trim();",
      '  return <div>{format(" value ")}</div>;',
      "}",
    ].join("\n"),
  },
  {
    name: "local variants inside a component body",
    source: [
      "export function Component() {",
      '  const variants = {default: "px-2"};',
      "  return <div className={variants.default} />;",
      "}",
    ].join("\n"),
  },
  {
    name: "props interface beside a component",
    source: ["interface Properties { label: string }", PROPERTIES_COMPONENT].join("\n"),
  },
  {
    name: "exported props interface beside a component",
    source: ["export interface Properties { label: string }", PROPERTIES_COMPONENT].join("\n"),
  },
];

const REJECT_CASES: BehaviorCase[] = [
  {
    name: "top-level component variants",
    source: [
      'import {cva} from "class-variance-authority";',
      'const componentVariants = cva("base");',
      SIMPLE_COMPONENT,
    ].join("\n"),
  },
  {
    name: "top-level helper function",
    source: [
      "function formatValue(value: string) { return value.trim(); }",
      "export function Component() { return <div>{formatValue('x')}</div>; }",
    ].join("\n"),
  },
  {
    name: "top-level constant",
    source: [
      'const label = "Save";',
      "export function Component() { return <button>{label}</button>; }",
    ].join("\n"),
  },
  {
    name: "top-level type alias",
    source: ["type Properties = {label: string};", PROPERTIES_COMPONENT].join("\n"),
  },
  {
    name: "top-level enum",
    source: [
      "enum Size { Small, Large }",
      "export function Component() { return <div>{Size.Small}</div>; }",
    ].join("\n"),
  },
  {
    name: "top-level class component",
    source: "export class Component { render() { return <div />; } }",
  },
  {
    name: "top-level side effect",
    source: ["setup();", SIMPLE_COMPONENT].join("\n"),
  },
  {
    name: "Next metadata export",
    source: ["export const metadata = {title: 'Example'};", DEFAULT_PAGE].join("\n"),
  },
  {
    name: "Next revalidate export",
    source: ["export const revalidate = 60;", DEFAULT_PAGE].join("\n"),
  },
  {
    name: "Next dynamic export",
    source: ["export const dynamic = 'force-static';", DEFAULT_PAGE].join("\n"),
  },
  {
    name: "Next generateMetadata helper",
    source: [
      "export function generateMetadata() { return {title: 'Example'}; }",
      DEFAULT_PAGE,
    ].join("\n"),
  },
  {
    name: "PascalCase non-component helper",
    source: [
      "function ParseOptions(value: string) { return value.trim(); }",
      SIMPLE_COMPONENT,
    ].join("\n"),
  },
  {
    name: "mixed component and non-component variable declaration",
    source: ["export const Component = () => <div />, helper = 1;"].join("\n"),
  },
  {
    name: "top-level object configuration",
    source: ["const config = {size: 'default'};", SIMPLE_COMPONENT].join("\n"),
  },
  {
    name: "exported type declaration",
    source: ["export type Properties = {label: string};", PROPERTIES_COMPONENT].join("\n"),
  },
  {
    name: "top-level namespace",
    source: ["namespace Internal { export const value = 1; }", SIMPLE_COMPONENT].join("\n"),
  },
  {
    name: "top-level regular expression",
    source: [
      "const pattern = /component/u;",
      "export function Component() { return <div>{pattern.source}</div>; }",
    ].join("\n"),
  },
];

ruleTester.run("component-module", componentModule, {
  valid: [
    ...ALLOW_CASES.map(({filePath = tsxFixture, name, source}) => ({
      code: source,
      filename: filePath,
      name,
    })),
    {
      code: "export function generateMetadata() { return {}; }",
      filename: tsxFixture,
      name: "allows an exported function with its exact configured name",
      options: [{allowDeclarations: ["generateMetadata"]}],
    },
    {
      code: "export const metadata = {};",
      filename: tsxFixture,
      name: "allows an exported variable with its exact configured name",
      options: [{allowDeclarations: ["metadata"]}],
    },
    {
      code: "export const metadata = {}, revalidate = 60;",
      filename: tsxFixture,
      name: "allows multiple exported variables when every name is configured",
      options: [{allowDeclarations: ["metadata", "revalidate"]}],
    },
  ],
  invalid: [
    ...REJECT_CASES.map(({filePath = tsxFixture, name, source}) => ({
      code: source,
      errors: [{messageId: "componentModule"}],
      filename: filePath,
      name,
    })),
    {
      code: "export const metadata = {}, metadataPreview = 60;",
      errors: [{messageId: "componentModule"}],
      filename: tsxFixture,
      name: "reports a multi-variable export when only one exact name is configured",
      options: [{allowDeclarations: ["metadata"]}],
    },
  ],
});
