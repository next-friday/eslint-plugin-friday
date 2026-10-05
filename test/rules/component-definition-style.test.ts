import {RuleTester} from "eslint";
import {parser as typescriptParser} from "typescript-eslint";
import {describe, it} from "vitest";

import {componentDefinitionStyle} from "../../src/rules/component-definition-style";

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

const filename = "component.tsx";

ruleTester.run("component-definition-style", componentDefinitionStyle, {
  valid: [
    {
      code: "export function Button() { return <button />; }",
      filename,
      name: "function declaration component",
    },
    {
      code: "export default function Button() { return <button />; }",
      filename,
      name: "default-exported named function declaration",
    },
    {
      code: "export default () => <button />;",
      filename,
      name: "anonymous default component has no module binding to standardize",
    },
    {
      code: "export const renderButton = () => <button />;",
      filename,
      name: "lowercase JSX utility is not a React component binding",
    },
    {
      code: "export const useButton = () => <button />;",
      filename,
      name: "custom Hook-shaped utility is not a component binding",
    },
  ],
  invalid: [
    {
      code: "export const Button = () => <button />;",
      errors: [{messageId: "functionDeclaration"}],
      filename,
      name: "arrow function component",
    },
    {
      code: "export const Button = function Button() { return <button />; };",
      errors: [{messageId: "functionDeclaration"}],
      filename,
      name: "function expression component",
    },
    {
      code: ['import {memo} from "react";', "export const Button = memo(() => <button />);"].join(
        "\n",
      ),
      errors: [{messageId: "functionDeclaration"}],
      filename,
      name: "memo-wrapped arrow component",
    },
    {
      code: [
        'import {forwardRef} from "react";',
        "export const Button = forwardRef((_props, ref) => <button ref={ref as never} />);",
      ].join("\n"),
      errors: [{messageId: "functionDeclaration"}],
      filename,
      name: "forwardRef-wrapped arrow component",
    },
  ],
});
