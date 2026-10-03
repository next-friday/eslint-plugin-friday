import {RuleTester} from "eslint";
import {parser as typescriptParser} from "typescript-eslint";
import {describe, it} from "vitest";

import {propsInBody} from "../../src/rules/props-in-body";

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

const BUTTON_RETURN = "  return <button>{label}</button>;";
const tsxFixture = "component.tsx";
const jsxFixture = "component.jsx";

type BehaviorCase = {
  filePath?: string;
  name: string;
  source: string;
};

const REJECT_CASES: BehaviorCase[] = [
  {
    name: "function declaration",
    source: "export function Button({label}: {label: string}) { return <button>{label}</button>; }",
  },
  {
    name: "fragment-returning function declaration",
    source: "export function Fragment({label}: {label: string}) { return <>{label}</>; }",
  },
  {
    name: "concise arrow component",
    source: "export const Button = ({label}: {label: string}) => <button>{label}</button>;",
  },
  {
    name: "block-bodied arrow component",
    source:
      "export const Button = ({label}: {label: string}) => { return <button>{label}</button>; };",
  },
  {
    name: "function expression component",
    source:
      "export const Button = function Button({label}: {label: string}) { return <button>{label}</button>; };",
  },
  {
    name: "nested object destructuring",
    source:
      "export function Button({theme: {color}}: {theme: {color: string}}) { return <button>{color}</button>; }",
  },
  {
    name: "rest properties and defaults in signature",
    source:
      'export function Button({label = "Save", ...rest}: {label?: string}) { return <button {...rest}>{label}</button>; }',
  },
  {
    name: "generic component",
    source: "export function Item<T>({value}: {value: T}) { return <div>{String(value)}</div>; }",
  },
  {
    name: "async server component",
    source: "export async function Page({slug}: {slug: string}) { return <main>{slug}</main>; }",
  },
  {
    name: "conditional JSX return",
    source:
      "export function Button({enabled}: {enabled: boolean}) { return enabled ? <button /> : <span />; }",
  },
  {
    name: "component returning null but using a Hook",
    source: [
      "declare function useState(value: string): [string, (value: string) => void];",
      "export function Component({value}: {value: string}) {",
      "  useState(value);",
      "  return null;",
      "}",
    ].join("\n"),
  },
  {
    name: "default-exported named component",
    source:
      "export default function Button({label}: {label: string}) { return <button>{label}</button>; }",
  },
  {
    name: "default parameter wrapping an object pattern",
    source: [
      'const defaults = {label: "Save"};',
      "export function Button({label}: {label: string} = defaults) {",
      BUTTON_RETURN,
      "}",
    ].join("\n"),
  },
  {
    name: "memo-wrapped arrow component",
    source: [
      'import {memo} from "react";',
      "export const Button = memo(({label}: {label: string}) => <button>{label}</button>);",
    ].join("\n"),
  },
  {
    name: "forwardRef-wrapped arrow component",
    source: [
      'import {forwardRef} from "react";',
      "export const Button = forwardRef(({label}: {label: string}, ref: unknown) => (",
      "  <button ref={ref as never}>{label}</button>",
      "));",
    ].join("\n"),
  },
  {
    name: "createElement component",
    source: [
      'import {createElement} from "react";',
      "export function Button({label}: {label: string}) {",
      '  return createElement("button", null, label);',
      "}",
    ].join("\n"),
  },
  {
    filePath: jsxFixture,
    name: "plain JSX component",
    source: "export function Button({label}) { return <button>{label}</button>; }",
  },
];

const ALLOW_CASES: BehaviorCase[] = [
  {
    name: "component destructures props inside the body",
    source: [
      "export function Button(props: {label: string}) {",
      "  const {label} = props;",
      BUTTON_RETURN,
      "}",
    ].join("\n"),
  },
  {
    name: "component preserves default values inside the body",
    source: [
      "export function Button(props: {label?: string}) {",
      '  const {label = "Save"} = props;',
      BUTTON_RETURN,
      "}",
    ].join("\n"),
  },
  {
    name: "component passes through rest properties from the body",
    source: [
      "export function Button(props: {label: string}) {",
      "  const {label, ...restProperties} = props;",
      "  return <button {...restProperties}>{label}</button>;",
      "}",
    ].join("\n"),
  },
  {
    name: "component with an identifier parameter and no body destructuring",
    source:
      "export function Button(props: {label: string}) { return <button>{props.label}</button>; }",
  },
  {
    name: "component without props",
    source: "export function Button() { return <button />; }",
  },
  {
    name: "lowercase JSX utility",
    source:
      "export function renderButton({label}: {label: string}) { return <button>{label}</button>; }",
  },
  {
    name: "PascalCase non-component utility",
    source: "export function ParseOptions({value}: {value: string}) { return value.trim(); }",
  },
  {
    name: "custom Hook with destructured options",
    source: "export function useThing({value}: {value: string}) { return value.length; }",
  },
  {
    name: "array parameter destructuring on a component",
    source:
      "export function Pair([left, right]: [string, string]) { return <div>{left}{right}</div>; }",
  },
  {
    name: "destructured callback parameter inside a component",
    source: [
      "export function List(props: {items: Array<{id: string}>}) {",
      "  return <div>{props.items.map(({id}) => <span key={id}>{id}</span>)}</div>;",
      "}",
    ].join("\n"),
  },
  {
    name: "destructured local handler parameter",
    source: [
      "export function Form() {",
      "  const handleSubmit = ({value}: {value: string}) => value;",
      '  return <form data-value={handleSubmit({value: "x"})} />;',
      "}",
    ].join("\n"),
  },
  {
    name: "nested JSX does not make an outer utility a component",
    source: [
      "export function Factory({value}: {value: string}) {",
      "  const render = () => <span>{value}</span>;",
      "  return render;",
      "}",
    ].join("\n"),
  },
];

ruleTester.run("props-in-body", propsInBody, {
  valid: ALLOW_CASES.map(({filePath = tsxFixture, name, source}) => ({
    code: source,
    filename: filePath,
    name,
  })),
  invalid: [
    ...REJECT_CASES.map(({filePath = tsxFixture, name, source}) => ({
      code: source,
      errors: [{messageId: "propertiesInBody"}],
      filename: filePath,
      name,
      output: null,
    })),
    {
      code: [
        "export function Bad({label}: {label: string}) { return <button>{label}</button>; }",
        "export function Good(props: {label: string}) {",
        "  const {label} = props;",
        BUTTON_RETURN,
        "}",
      ].join("\n"),
      errors: [
        {
          line: 1,
          messageId: "propertiesInBody",
        },
      ],
      filename: tsxFixture,
      name: "reports only the offending components in a mixed module",
    },
  ],
});
