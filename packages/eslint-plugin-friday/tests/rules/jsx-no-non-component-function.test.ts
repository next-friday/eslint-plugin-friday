import rule from "../../src/rules/jsx-no-non-component-function.js";
import { createRuleTester, fixtureCode } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("jsx-no-non-component-function", rule, {
  valid: [
    {
      name: "allow-listed arrow function name",
      code: `const useThing = () => 1;`,
      filename: "Component.tsx",
      options: [{ allow: ["useThing"] }],
    },
    {
      name: "allow-listed function declaration name",
      code: `function helper() { return 1; }`,
      filename: "Component.tsx",
      options: [{ allow: ["helper"] }],
    },
    {
      name: "helper function inside component",
      code: `
        const Component = () => {
          const helper = (name: string) => {
            return name.toUpperCase();
          };
          return <div>{helper("test")}</div>;
        };
      `,
      filename: "Component.tsx",
    },
    {
      name: "imported helper function",
      code: `
        import { helper } from "./helper";

        const Component = () => {
          return <div>{helper("test")}</div>;
        };
      `,
      filename: "Component.tsx",
    },
    {
      name: "component only",
      code: `
        const Component = () => {
          return <div>Hello</div>;
        };
      `,
      filename: "Component.tsx",
    },
    {
      name: "helper in .ts file is allowed",
      code: `
        const helper = (name: string) => {
          return name.toUpperCase();
        };
      `,
      filename: "helper.ts",
    },
    {
      name: "helper in .js file is allowed",
      code: `
        const helper = (name) => {
          return name.toUpperCase();
        };
      `,
      filename: "utils.js",
    },
    {
      name: "exported component",
      code: `
        export const Component = () => {
          return <div>Hello</div>;
        };
      `,
      filename: "Component.tsx",
    },
    {
      name: "component with PascalCase name",
      code: `
        const MyComponent = () => <div>Hello</div>;
      `,
      filename: "Component.tsx",
    },
    {
      name: "function declaration component",
      code: `
        function Component() {
          return <div>Hello</div>;
        }
      `,
      filename: "Component.tsx",
    },
    {
      name: "exported function declaration component",
      code: `
        export function Component() {
          return <div>Hello</div>;
        }
      `,
      filename: "Component.tsx",
    },
    {
      name: "arrow function with ReactElement return type",
      code: `
        const renderItem = (): ReactElement => <div>Item</div>;
      `,
      filename: "Component.tsx",
    },
    {
      name: "function declaration with ReactNode return type",
      code: `
        function render(): ReactNode {
          return null;
        }
      `,
      filename: "Component.tsx",
    },
  ],
  invalid: [
    {
      name: "destructured arrow has no resolvable name to allow",
      code: `const [helper] = () => 1;`,
      filename: "Component.tsx",
      options: [{ allow: ["helper"] }],
      errors: [{ messageId: "noTopLevelFunction" }],
    },
    {
      name: "helper function outside component",
      code: fixtureCode`
        const helper = (name: string) => {
          const words = name.trim().split(/\s+/);
          if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
          }
          return words
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
        };

        const Component = () => {
          return <div>{helper("test")}</div>;
        };
      `,
      filename: "Component.tsx",
      errors: [{ messageId: "noTopLevelFunction" }],
    },
    {
      name: "arrow function helper outside component",
      code: `
        const formatName = (name: string) => name.toUpperCase();

        const Component = () => {
          return <div>{formatName("test")}</div>;
        };
      `,
      filename: "Component.tsx",
      errors: [{ messageId: "noTopLevelFunction" }],
    },
    {
      name: "function declaration helper outside component",
      code: `
        function helper(name: string) {
          return name.toUpperCase();
        }

        const Component = () => {
          return <div>{helper("test")}</div>;
        };
      `,
      filename: "Component.tsx",
      errors: [{ messageId: "noTopLevelFunction" }],
    },
    {
      name: "function expression helper outside component",
      code: `
        const helper = function (name: string) {
          return name;
        };

        const C = () => <div />;
      `,
      filename: "Component.tsx",
      errors: [{ messageId: "noTopLevelFunction" }],
    },
    {
      name: "helper before exported component",
      code: `
        const calculateTotal = (items: number[]) => {
          return items.reduce((sum, item) => sum + item, 0);
        };

        export const OrderSummary = () => {
          return <div>Total</div>;
        };
      `,
      filename: "OrderSummary.tsx",
      errors: [{ messageId: "noTopLevelFunction" }],
    },
    {
      name: "helper in .jsx file",
      code: `
        const processData = (data) => data.trim();

        const AnotherComponent = () => <div>Test</div>;
      `,
      filename: "test.jsx",
      errors: [{ messageId: "noTopLevelFunction" }],
    },
  ],
});
