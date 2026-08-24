import rule from "../../src/rules/prefer-properties-with-children.js";
import { createRuleTester, fixtureCode } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("prefer-properties-with-children", rule, {
  valid: [
    {
      name: "interface without children",
      code: `
          interface ButtonProps {
            label: string;
            onClick: () => void;
          }
        `,
      filename: "Component.tsx",
    },
    {
      name: "type alias without children",
      code: `
          type CardProps = {
            title: string;
            description: string;
          };
        `,
      filename: "Component.tsx",
    },
    {
      name: "interface extending PropsWithChildren",
      code: `
          interface LayoutProps extends PropsWithChildren {
            title: string;
          }
        `,
      filename: "Component.tsx",
    },
    {
      name: "PropsWithChildren type alias",
      code: `
          type ContainerProps = PropsWithChildren<{ className: string }>;
        `,
      filename: "Component.tsx",
    },
    {
      name: "render-prop children",
      code: `
          interface RenderProps {
            children: (value: string) => ReactNode;
          }
        `,
      filename: "Component.tsx",
    },
    {
      name: "ReactElement children",
      code: `
          interface SlotProps {
            children: ReactElement;
          }
        `,
      filename: "Component.tsx",
    },
    {
      name: "string children",
      code: `
          interface TextProps {
            children: string;
          }
        `,
      filename: "Component.tsx",
    },
    {
      name: "union children",
      code: `
          interface UnionProps {
            children: ReactNode | string;
          }
        `,
      filename: "Component.tsx",
    },
    {
      name: "PropsWithChildren param",
      code: fixtureCode`
          const Component = (props: PropsWithChildren<{ label: string }>) => <div>{props.children}</div>;
        `,
      filename: "Component.tsx",
    },
    {
      name: "required children: ReactNode",
      code: `
          interface LayoutProps {
            children: ReactNode;
          }
        `,
      filename: "Component.tsx",
    },
    {
      name: "required children: ReactNode with other props",
      code: `
          interface CardProps {
            title: string;
            children: ReactNode;
          }
        `,
      filename: "Component.tsx",
    },
    {
      name: "required children: ReactNode in type alias",
      code: `
          type WrapperProps = {
            children: ReactNode;
            className: string;
          };
        `,
      filename: "Component.tsx",
    },
    {
      name: "required children: ReactNode in inline type",
      code: fixtureCode`
          const Component = ({ children, label }: { children: ReactNode; label: string }) => <div>{children}{label}</div>;
        `,
      filename: "Component.tsx",
    },
    {
      name: "required children: ReactNode in function props",
      code: fixtureCode`
          function Layout(props: { children: ReactNode }) {
            return <div>{props.children}</div>;
          }
        `,
      filename: "Component.tsx",
    },
    {
      name: "required children: React.ReactNode",
      code: `
          interface ReactNamespaceProps {
            children: React.ReactNode;
          }
        `,
      filename: "Component.tsx",
    },
    {
      name: "optional children with non-reference type",
      code: `
          interface TextProps {
            children?: string;
          }
        `,
      filename: "Component.tsx",
    },
    {
      name: "optional children: ReactNode in non-jsx file",
      code: `
          interface LayoutProps {
            children?: ReactNode;
          }
        `,
      filename: "types.ts",
    },
  ],
  invalid: [
    {
      name: "optional children: ReactNode with other props",
      code: `
          interface OptionalChildrenProps {
            children?: ReactNode;
            label: string;
          }
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "usePropsWithChildren" }],
    },
    {
      name: "optional children: ReactNode only",
      code: `
          interface LayoutProps {
            children?: ReactNode;
          }
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "usePropsWithChildren" }],
    },
    {
      name: "optional children: ReactNode in type alias",
      code: `
          type WrapperProps = {
            children?: ReactNode;
            className: string;
          };
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "usePropsWithChildren" }],
    },
    {
      name: "optional children: React.ReactNode",
      code: `
          interface ReactNamespaceProps {
            children?: React.ReactNode;
          }
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "usePropsWithChildren" }],
    },
    {
      name: "optional children: ReactNode in function props",
      code: fixtureCode`
          function Layout(props: { children?: ReactNode }) {
            return <div>{props.children}</div>;
          }
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "usePropsWithChildren" }],
    },
  ],
});
