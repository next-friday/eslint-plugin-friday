import rule from "../../src/rules/jsx-spread-properties-last.js";
import { createRuleTester, fixtureCode } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("jsx-spread-properties-last", rule, {
  valid: [
    { name: "no props", code: `<Component />`, filename: "Component.tsx" },
    {
      name: "only non-spread props",
      code: `<Component name="x" />`,
      filename: "Component.tsx",
    },
    {
      name: "multiple non-spread props",
      code: `<Component name="x" count={1} disabled />`,
      filename: "Component.tsx",
    },
    {
      name: "only spread",
      code: `<Component {...props} />`,
      filename: "Component.tsx",
    },
    {
      name: "spread last",
      code: `<Component name="x" {...props} />`,
      filename: "Component.tsx",
    },
    {
      name: "spread last with multiple non-spread props",
      code: fixtureCode`<Component baz="baz" foobar={foobar} {...bes} />`,
      filename: "Component.tsx",
    },
    {
      name: "consecutive spreads only",
      code: `<Component {...a} {...b} />`,
      filename: "Component.tsx",
    },
    {
      name: "multiple spreads at the end",
      code: `<Component name="x" {...a} {...b} />`,
      filename: "Component.tsx",
    },
    {
      name: "non-jsx file is skipped",
      code: `const props = { ...bes, baz: "baz" };`,
      filename: "component.ts",
    },
  ],
  invalid: [
    {
      name: "spread before all other props",
      code: fixtureCode`<Component {...bes} baz="baz" foobar={foobar} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "spreadNotLast" }],
    },
    {
      name: "spread between non-spread props",
      code: fixtureCode`<Component baz="baz" {...bes} foobar={foobar} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "spreadNotLast" }],
    },
    {
      name: "only the misplaced spread when others are last",
      code: `<Component {...a} name="x" {...b} />`,
      filename: "Component.tsx",
      errors: [{ messageId: "spreadNotLast" }],
    },
    {
      name: "each spread that is not last",
      code: `<Component {...a} {...b} name="x" />`,
      filename: "Component.tsx",
      errors: [{ messageId: "spreadNotLast" }, { messageId: "spreadNotLast" }],
    },
  ],
});
