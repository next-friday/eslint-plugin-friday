import rule from "../../src/rules/render-naming.js";
import { createRuleTester, fixtureCode } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("render-naming", rule, {
  valid: [
    {
      name: "allow-listed JSX local name",
      filename: "Component.tsx",
      code: `const Component = () => { const content = <div />; return content; };`,
      options: [{ allow: ["content"] }],
    },
    {
      name: "value-form JSX with render prefix",
      filename: "Component.tsx",
      code: `const Component = () => { const renderHeader = <div />; return renderHeader; };`,
    },
    {
      name: "function-form JSX with render prefix",
      filename: "Component.tsx",
      code: `const Component = () => { const renderHeader = () => <div />; return renderHeader(); };`,
    },
    {
      name: "render prefix on .map result",
      filename: "Component.tsx",
      code: fixtureCode`const Component = (props) => { const renderCardElements = props.items.map((item) => <Card {...item} />); return <div>{renderCardElements}</div>; };`,
    },
    {
      name: "non-JSX variables are not flagged",
      filename: "Component.tsx",
      code: fixtureCode`const Component = () => { const count = 5; const label = "hello"; return <div>{label}</div>; };`,
    },
    {
      name: "array of primitives is not JSX-producing",
      filename: "Component.tsx",
      code: fixtureCode`const Component = () => { const items = [1, 2, 3]; return <div>{items.length}</div>; };`,
    },
    {
      name: "non-PascalCase function does not enforce naming",
      filename: "Component.tsx",
      code: `function notAComponent() { const header = <div />; return header; }`,
    },
    {
      name: "non-jsx file is not checked",
      filename: "Component.ts",
      code: `const Component = () => { const count = 5; return count; };`,
    },
  ],
  invalid: [
    {
      name: "value-form JSX without render prefix",
      filename: "Component.tsx",
      code: `const Component = () => { const header = <div />; return header; };`,
      errors: [
        {
          messageId: "missingRenderPrefix",
          data: { name: "header", pascalName: "Header" },
        },
      ],
    },
    {
      name: "renderer is not a render-prefix",
      filename: "Component.tsx",
      code: `const Component = () => { const renderer = () => <div />; return renderer(); };`,
      errors: [
        {
          messageId: "missingRenderPrefix",
          data: { name: "renderer", pascalName: "Renderer" },
        },
      ],
    },
    {
      name: "missing render prefix on .map result",
      filename: "Component.tsx",
      code: fixtureCode`const Component = (props) => { const cardElements = props.items.map((item) => <Card {...item} />); return <div>{cardElements}</div>; };`,
      errors: [
        {
          messageId: "missingRenderPrefix",
          data: { name: "cardElements", pascalName: "CardElements" },
        },
      ],
    },
    {
      name: "missing render prefix on .map with block return",
      filename: "Component.tsx",
      code: fixtureCode`const Component = (props) => { const phoneEntries = props.phones.map((phone) => { return <span>{phone}</span>; }); return <div>{phoneEntries}</div>; };`,
      errors: [
        {
          messageId: "missingRenderPrefix",
          data: { name: "phoneEntries", pascalName: "PhoneEntries" },
        },
      ],
    },
    {
      name: "missing render prefix on conditional JSX",
      filename: "Component.tsx",
      code: `const Component = (props) => { const fallback = props.condition ? <A /> : <B />; return fallback; };`,
      errors: [
        {
          messageId: "missingRenderPrefix",
          data: { name: "fallback", pascalName: "Fallback" },
        },
      ],
    },
    {
      name: "missing render prefix on logical AND with JSX",
      filename: "Component.tsx",
      code: `const Component = (props) => { const banner = props.isVisible && <Banner />; return banner; };`,
      errors: [
        {
          messageId: "missingRenderPrefix",
          data: { name: "banner", pascalName: "Banner" },
        },
      ],
    },
    {
      name: "function-form JSX without render prefix",
      filename: "Component.tsx",
      code: `const Component = () => { const header = () => <div />; return header(); };`,
      errors: [
        {
          messageId: "missingRenderPrefix",
          data: { name: "header", pascalName: "Header" },
        },
      ],
    },
    {
      name: "function declaration component",
      filename: "Component.tsx",
      code: `function Component() { const header = <div />; return header; }`,
      errors: [
        {
          messageId: "missingRenderPrefix",
          data: { name: "header", pascalName: "Header" },
        },
      ],
    },
    {
      name: "default-exported function declaration component",
      filename: "Component.tsx",
      code: `export default function Component() { const header = <div />; return header; }`,
      errors: [
        {
          messageId: "missingRenderPrefix",
          data: { name: "header", pascalName: "Header" },
        },
      ],
    },
    {
      name: "JSX variable inside nested block",
      filename: "Component.tsx",
      code: `const Component = () => { if (true) { const nestedHeader = <div />; return nestedHeader; } return null; };`,
      errors: [
        {
          messageId: "missingRenderPrefix",
          data: { name: "nestedHeader", pascalName: "NestedHeader" },
        },
      ],
    },
  ],
});
