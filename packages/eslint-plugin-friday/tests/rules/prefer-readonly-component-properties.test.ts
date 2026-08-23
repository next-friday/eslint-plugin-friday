import rule from "../../src/rules/prefer-readonly-component-properties.js";
import { createRuleTester, fixtureCode } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("prefer-readonly-component-properties", rule, {
  valid: [
    {
      name: "Readonly-wrapped interface props",
      code: fixtureCode`
          interface Props {
            children: ReactNode;
          }
          const Component = (props: Readonly<Props>) => <div>{props.children}</div>;
        `,
      filename: "Component.tsx",
    },
    {
      name: "Readonly-wrapped type alias props",
      code: fixtureCode`
          type ComponentProps = {
            title: string;
            onClick: () => void;
          };
          const Component = (props: Readonly<ComponentProps>) => <div>{props.title}</div>;
        `,
      filename: "Component.tsx",
    },
    {
      name: "inline object type props",
      code: fixtureCode`
          const Component = (props: { children: ReactNode }) => <div>{props.children}</div>;
        `,
      filename: "Component.tsx",
    },
    {
      name: "non-component helper function",
      code: `
          interface HelperProps {
            value: number;
            name: string;
          }
          const helper = (props: HelperProps) => {
            return props.value + props.name.length;
          };
        `,
      filename: "Component.tsx",
    },
    {
      name: "component without props",
      code: `
          const Component = () => <div>Hello</div>;
        `,
      filename: "Component.tsx",
    },
    {
      name: "component with more than one param",
      code: fixtureCode`
          interface Props {
            title: string;
          }
          const Component = (props: Props, ref: any) => <div>{props.title}</div>;
        `,
      filename: "Component.tsx",
    },
    {
      name: "component with primitive param type",
      code: fixtureCode`
          const Component = (text: string) => <div>{text}</div>;
        `,
      filename: "Component.tsx",
    },
    {
      name: "non-jsx file is not checked",
      code: `
          interface Props {
            children: ReactNode;
          }
          const Component = (props: Props) => props.children;
        `,
      filename: "Component.ts",
    },
    {
      name: "component with destructured props param",
      code: fixtureCode`
          interface Props {
            children: ReactNode;
          }
          const Component = ({ children }: Props) => <div>{children}</div>;
        `,
      filename: "Component.tsx",
    },
    {
      name: "component with untyped props param",
      code: fixtureCode`
          const Component = (props) => <div>{props.children}</div>;
        `,
      filename: "Component.tsx",
    },
  ],
  invalid: [
    {
      name: "arrow component with interface props",
      code: fixtureCode`
          interface Props {
            children: ReactNode;
          }
          const Component = (props: Props) => <div>{props.children}</div>;
        `,
      filename: "Component.tsx",
      output: fixtureCode`
          interface Props {
            children: ReactNode;
          }
          const Component = (props: Readonly<Props>) => <div>{props.children}</div>;
        `,
      errors: [{ messageId: "useReadonly" }],
    },
    {
      name: "arrow component with type alias props",
      code: fixtureCode`
          type ComponentProps = {
            title: string;
            onClick: () => void;
          };
          const Component = (props: ComponentProps) => <div>{props.title}</div>;
        `,
      filename: "Component.tsx",
      output: fixtureCode`
          type ComponentProps = {
            title: string;
            onClick: () => void;
          };
          const Component = (props: Readonly<ComponentProps>) => <div>{props.title}</div>;
        `,
      errors: [{ messageId: "useReadonly" }],
    },
    {
      name: "function declaration component",
      code: fixtureCode`
          interface Props {
            data: string;
          }
          function Component(props: Props) {
            return <div>{props.data}</div>;
          }
        `,
      filename: "Component.tsx",
      output: fixtureCode`
          interface Props {
            data: string;
          }
          function Component(props: Readonly<Props>) {
            return <div>{props.data}</div>;
          }
        `,
      errors: [{ messageId: "useReadonly" }],
    },
    {
      name: "function expression component",
      code: fixtureCode`
          type Props = {
            config: string;
          };
          const Component = function(props: Props) {
            return <div>{props.config}</div>;
          };
        `,
      filename: "Component.tsx",
      output: fixtureCode`
          type Props = {
            config: string;
          };
          const Component = function(props: Readonly<Props>) {
            return <div>{props.config}</div>;
          };
        `,
      errors: [{ messageId: "useReadonly" }],
    },
    {
      name: "component returning conditional JSX",
      code: fixtureCode`
          interface LayoutProps {
            children: ReactNode;
            title?: string;
          }
          const Layout = (props: LayoutProps) => {
            return props.title ? <div><h1>{props.title}</h1>{props.children}</div> : <div>{props.children}</div>;
          };
        `,
      filename: "Component.tsx",
      output: fixtureCode`
          interface LayoutProps {
            children: ReactNode;
            title?: string;
          }
          const Layout = (props: Readonly<LayoutProps>) => {
            return props.title ? <div><h1>{props.title}</h1>{props.children}</div> : <div>{props.children}</div>;
          };
        `,
      errors: [{ messageId: "useReadonly" }],
    },
  ],
});
