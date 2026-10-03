import {RuleTester} from "eslint";
import {parser as typescriptParser} from "typescript-eslint";
import {describe, it} from "vitest";

import {namedProps} from "../../src/rules/named-props";

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

const tsxFixture = "component.tsx";

type BehaviorCase = {
  filePath?: string;
  name: string;
  source: string;
};

const TYPES = [
  "interface PrimitiveProps { disabled?: boolean }",
  'interface VariantProperties { size?: "small" | "large" }',
].join("\n");

const REJECT_CASES: BehaviorCase[] = [
  {
    name: "inline intersection on a function component",
    source: [
      TYPES,
      "export function Button(props: PrimitiveProps & VariantProperties) { return <button />; }",
    ].join("\n"),
  },
  {
    name: "inline intersection on an async component",
    source: [
      TYPES,
      "export async function Page(props: PrimitiveProps & VariantProperties) { return <main />; }",
    ].join("\n"),
  },
  {
    name: "inline intersection on an arrow component",
    source: [
      TYPES,
      "export const Button = (props: PrimitiveProps & VariantProperties) => <button />;",
    ].join("\n"),
  },
  {
    name: "inline intersection wrapped by a default parameter",
    source: [
      TYPES,
      "declare const defaults: PrimitiveProps & VariantProperties;",
      "export function Button(props: PrimitiveProps & VariantProperties = defaults) { return <button />; }",
    ].join("\n"),
  },
];

const ALLOW_CASES: BehaviorCase[] = [
  {
    name: "named props interface extending both contracts",
    source: [
      TYPES,
      "interface ButtonProps extends PrimitiveProps, VariantProperties {}",
      "export function Button(props: ButtonProps) { return <button />; }",
    ].join("\n"),
  },
  {
    name: "single named props type",
    source: [TYPES, "export function Button(props: PrimitiveProps) { return <button />; }"].join(
      "\n",
    ),
  },
  {
    name: "inline object type because this rule only owns intersections",
    source: "export function Button(props: {disabled?: boolean}) { return <button />; }",
  },
  {
    name: "component without props",
    source: "export function Button() { return <button />; }",
  },
  {
    name: "utility function intersection parameter",
    source: [
      TYPES,
      "export function mergeProperties(props: PrimitiveProps & VariantProperties) { return props; }",
    ].join("\n"),
  },
  {
    name: "intersection on a forwardRef reference parameter only",
    source: [
      'import {forwardRef} from "react";',
      "interface ButtonProps { disabled?: boolean }",
      "type RefA = {current: HTMLButtonElement | null};",
      "type RefB = {readonlyRef?: boolean};",
      "export const Button = forwardRef((props: ButtonProps, reference: RefA & RefB) => <button />);",
    ].join("\n"),
  },
];

ruleTester.run("named-props", namedProps, {
  valid: ALLOW_CASES.map(({filePath = tsxFixture, name, source}) => ({
    code: source,
    filename: filePath,
    name,
  })),
  invalid: REJECT_CASES.map(({filePath = tsxFixture, name, source}) => ({
    code: source,
    errors: [{messageId: "namedProperties"}],
    filename: filePath,
    name,
  })),
});
