import rule from "../../src/rules/prefer-named-parameter-types.js";
import { createRuleTester, fixtureCode } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("prefer-named-parameter-types", rule, {
  valid: [
    {
      code: `
        interface Params {
          bar: string;
          baz: number;
        }
        const foo = (params: Params) => {
          const { bar, baz } = params;
        };
      `,
    },
    {
      code: `
        type Params = {
          bar: string;
          baz: number;
        };
        const foo = (params: Params) => {
          const { bar, baz } = params;
        };
      `,
    },
    {
      code: `
        interface Params {
          bar: string;
          baz: number;
        }
        function foo(params: Params) {
          const { bar, baz } = params;
        }
      `,
    },
    {
      code: `
        const foo = (value: string) => {
          return value;
        };
      `,
    },
    {
      code: `
        const foo = (count: number, enabled: boolean) => {
          return count > 0 && enabled;
        };
      `,
    },
    {
      code: `
        const foo = () => {
          return "no params";
        };
      `,
    },
    {
      code: `
        type Config = {
          theme: string;
          locale: string;
        };
        const setup = (config: Config) => {
          console.log(config.theme);
        };
      `,
    },
    {
      name: "should defer to prefer-interface-over-inline-types for React components with non-destructured props",
      code: fixtureCode`
        function Comp(props: { name: string }) {
          return <div>{props.name}</div>;
        }
      `,
    },
    {
      name: "should defer for arrow React components with non-destructured props",
      code: fixtureCode`
        const Comp = (props: { name: string }) => {
          return <div>{props.name}</div>;
        };
      `,
    },
    {
      name: "should allow class methods whose parameters use named types",
      code: `
        interface Params {
          bar: string;
          baz: number;
        }
        class Service {
          run(params: Params) {
            return params.bar;
          }
        }
      `,
    },
  ],
  invalid: [
    {
      code: fixtureCode`
        function Comp({ name }: { name: string }) {
          return <div>{name}</div>;
        }
      `,
      errors: [{ messageId: "preferNamedParamTypes" }],
    },
    {
      code: `
        const foo = ({ bar, baz }: { bar: string; baz: number }) => {
          console.log(bar, baz);
        };
      `,
      errors: [{ messageId: "preferNamedParamTypes" }],
    },
    {
      code: `
        const foo = (params: { bar: string; baz: number }) => {
          const { bar, baz } = params;
        };
      `,
      errors: [{ messageId: "preferNamedParamTypes" }],
    },
    {
      code: `
        function foo(params: { bar: string; baz: number }) {
          const { bar, baz } = params;
        }
      `,
      errors: [{ messageId: "preferNamedParamTypes" }],
    },
    {
      code: `
        const handler = function(data: { id: number; name: string }) {
          return data.id;
        };
      `,
      errors: [{ messageId: "preferNamedParamTypes" }],
    },
    {
      code: `
        const process = ({ value, label }: { value: number; label: string }) => {
          return \`\${label}: \${value}\`;
        };
      `,
      errors: [{ messageId: "preferNamedParamTypes" }],
    },
    {
      code: `
        const foo = (options: { enabled: boolean; count: number; items: string[] }) => {
          return options.enabled ? options.items.slice(0, options.count) : [];
        };
      `,
      errors: [{ messageId: "preferNamedParamTypes" }],
    },
    {
      code: `
        const createUser = (data: { name: string; email: string; role: 'admin' | 'user' }) => {
          return { ...data, createdAt: Date.now() };
        };
      `,
      errors: [{ messageId: "preferNamedParamTypes" }],
    },
    {
      code: `
        const foo = (
          first: { a: string; b: number },
          second: { x: boolean; y: string }
        ) => {
          return { first, second };
        };
      `,
      errors: [
        { messageId: "preferNamedParamTypes" },
        { messageId: "preferNamedParamTypes" },
      ],
    },
    {
      name: "should flag class methods with inline object parameter types",
      code: `
        class Service {
          run(params: { bar: string; baz: number }) {
            return params.bar;
          }
        }
      `,
      errors: [
        { messageId: "preferNamedParamTypes" },
        { messageId: "preferNamedParamTypes" },
      ],
    },
  ],
});
