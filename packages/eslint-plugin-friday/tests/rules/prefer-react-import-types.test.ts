import rule from "../../src/rules/prefer-react-import-types.js";
import { createRuleTester, fixtureCode } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("prefer-react-import-types", rule, {
  valid: [
    {
      name: "direct ReactNode import",
      code: fixtureCode`
        import type { ReactNode } from "react";
        const Component = (props: { children: ReactNode }) => <div>{props.children}</div>;
      `,
      filename: "Component.tsx",
    },
    {
      name: "direct useState import",
      code: fixtureCode`
        import { useState } from "react";
        const Component = () => {
          const [state, setState] = useState(0);
          return <div>{state}</div>;
        };
      `,
      filename: "Component.tsx",
    },
    {
      name: "direct FC import",
      code: `
        import type { FC } from "react";
        const Component: FC = () => <div>Hello</div>;
      `,
      filename: "Component.tsx",
    },
    {
      name: "direct memo import",
      code: `
        import { memo } from "react";
        const Component = memo(() => <div>Hello</div>);
      `,
      filename: "Component.tsx",
    },
    {
      name: "non-React ReactNode property access",
      code: `
        const obj = { ReactNode: "test" };
        console.log(obj.ReactNode);
      `,
      filename: "Component.tsx",
    },
    {
      name: "non-React qualified type reference",
      code: `
        namespace NS {
          export type ReactNode = string;
        }
        const value: NS.ReactNode = "test";
      `,
      filename: "Component.tsx",
    },
    {
      name: "direct ReactNode import in interface",
      code: `
        import type { ReactNode } from "react";
        interface Props {
          children: ReactNode;
        }
      `,
      filename: "Component.tsx",
    },
    {
      name: "non-jsx file ignores React member expression",
      code: `
        const element = React.createElement('div', null, 'Hello');
      `,
      filename: "component.ts",
    },
    {
      name: "non-jsx file ignores React qualified type",
      code: `
        const handler = (node: React.ReactNode): React.ReactNode => node;
      `,
      filename: "component.ts",
    },
  ],
  invalid: [
    {
      name: "React.ReactNode type reference",
      code: fixtureCode`
        const Component = (props: { children: React.ReactNode }) => <div>{props.children}</div>;
      `,
      filename: "Component.tsx",
      errors: [
        {
          messageId: "preferDirectImport",
          data: {
            typeName: "ReactNode",
            importStatement: 'import type { ReactNode } from "react"',
          },
        },
      ],
    },
    {
      name: "React.useState call",
      code: fixtureCode`
        const Component = () => {
          const [state, setState] = React.useState(0);
          return <div>{state}</div>;
        };
      `,
      filename: "Component.tsx",
      errors: [
        {
          messageId: "preferDirectImport",
          data: {
            typeName: "useState",
            importStatement: 'import { useState } from "react"',
          },
        },
      ],
    },
    {
      name: "React.FC type reference",
      code: `
        const Component: React.FC = () => <div>Hello</div>;
      `,
      filename: "Component.tsx",
      errors: [
        {
          messageId: "preferDirectImport",
          data: {
            typeName: "FC",
            importStatement: 'import type { FC } from "react"',
          },
        },
      ],
    },
    {
      name: "React.memo call",
      code: `
        const Component = React.memo(() => <div>Hello</div>);
      `,
      filename: "Component.tsx",
      errors: [
        {
          messageId: "preferDirectImport",
          data: {
            typeName: "memo",
            importStatement: 'import { memo } from "react"',
          },
        },
      ],
    },
    {
      name: "multiple React member expressions",
      code: `
        const element = React.createElement('div', null, 'Hello');
        const Fragment = React.Fragment;
      `,
      filename: "Component.tsx",
      errors: [
        {
          messageId: "preferDirectImport",
          data: {
            typeName: "createElement",
            importStatement: 'import { createElement } from "react"',
          },
        },
        {
          messageId: "preferDirectImport",
          data: {
            typeName: "Fragment",
            importStatement: 'import { Fragment } from "react"',
          },
        },
      ],
    },
  ],
});
