import rule from "../../src/rules/jsx-simple-properties.js";
import { createRuleTester, fixtureCode } from "../setup.js";

const DOLLAR = "$";

const ruleTester = createRuleTester(true);

ruleTester.run("jsx-simple-properties", rule, {
  valid: [
    {
      name: "string literal",
      code: `<Component name="test" />`,
      filename: "Component.tsx",
    },
    {
      name: "string in expression container",
      code: `<Component name={'test'} />`,
      filename: "Component.tsx",
    },
    {
      name: "simple variable",
      code: fixtureCode`<Component value={foo} />`,
      filename: "Component.tsx",
    },
    {
      name: "JSX element",
      code: `<Component icon={<Icon />} />`,
      filename: "Component.tsx",
    },
    {
      name: "JSX fragment",
      code: `<Component icon={<><span>test</span></>} />`,
      filename: "Component.tsx",
    },
    {
      name: "member expression",
      code: fixtureCode`<Component value={foo.bar} />`,
      filename: "Component.tsx",
    },
    {
      name: "nested member expression",
      code: fixtureCode`<Component value={foo.bar.baz} />`,
      filename: "Component.tsx",
    },
    {
      name: "boolean shorthand",
      code: `<Component disabled />`,
      filename: "Component.tsx",
    },
    {
      name: "number literal",
      code: `<Component count={42} />`,
      filename: "Component.tsx",
    },
    {
      name: "boolean literal",
      code: fixtureCode`<Component disabled={true} />`,
      filename: "Component.tsx",
    },
    {
      name: "null literal",
      code: fixtureCode`<Component value={null} />`,
      filename: "Component.tsx",
    },
    {
      name: "spread attributes",
      code: `<Component {...props} />`,
      filename: "Component.tsx",
    },
    {
      name: "undefined identifier",
      code: fixtureCode`<Component value={undefined} />`,
      filename: "Component.tsx",
    },
    {
      name: "arrow function",
      code: `<Component callback={() => {}} />`,
      filename: "Component.tsx",
    },
    {
      name: "function expression",
      code: `<Component callback={function() {}} />`,
      filename: "Component.tsx",
    },
    {
      name: "empty expression container",
      code: `<Component value={/* comment */} />`,
      filename: "Component.tsx",
    },
    {
      name: "non-jsx file is skipped",
      code: `<Component onClick={handleClick()} />`,
      filename: "Component.js",
    },
  ],
  invalid: [
    {
      name: "function call",
      code: `<Component onClick={handleClick()} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "complex nested function call",
      code: `<Component data={bar(baz({ aaa, bbb, ccc }), eee)} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "empty inline object",
      code: `<Component style={{}} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "inline object",
      code: `<Component style={{ color: "red" }} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "empty inline array",
      code: `<Component items={[]} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "inline array",
      code: `<Component items={[1, 2, 3]} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "binary expression",
      code: `<Component value={a + b} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "unary expression",
      code: `<Component value={!flag} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "ternary expression",
      code: `<Component value={condition ? a : b} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "logical expression",
      code: `<Component value={a && b} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "template literal with expressions",
      code: fixtureCode`<Component value={\`template ${DOLLAR}{name}\`} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "new expression",
      code: `<Component value={new Date()} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }],
    },
    {
      name: "multiple violations",
      code: `<><Foo a={fn()} /><Bar b={{}} /></>`,
      filename: "Component.tsx",
      errors: [{ messageId: "noComplexProp" }, { messageId: "noComplexProp" }],
    },
  ],
});
