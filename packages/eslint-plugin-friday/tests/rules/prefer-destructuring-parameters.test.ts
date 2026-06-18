import rule from "../../src/rules/prefer-destructuring-parameters.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("prefer-destructuring-parameters", rule, {
  valid: [
    { name: "no parameters", code: `function foo() {}` },
    { name: "one parameter", code: `function foo(oneParam) {}` },
    {
      name: "single destructured parameter",
      code: `function foo({ oneParam, twoParam }) {}`,
    },
    { name: "arrow with one parameter", code: `const foo = (oneParam) => {}` },
    {
      name: "arrow with destructured parameter",
      code: `const foo = ({ oneParam, twoParam }) => {}`,
    },
    {
      name: "method with one parameter",
      code: `const obj = { foo(oneParam) {} }`,
    },
    {
      name: "class method with one parameter",
      code: `class MyClass { foo(oneParam) {} }`,
    },
    {
      name: "two positional parameters are allowed by default",
      code: `function foo(oneParam, twoParam) {}`,
    },
    {
      name: "arrow with two positional parameters allowed by default",
      code: `const foo = (oneParam, twoParam) => {}`,
    },
    {
      name: "three destructured parameters",
      code: `function foo({ a }, { b }, { c }) {}`,
    },
    {
      name: "three parameters ending in a rest element",
      code: `function foo({ a }, { b }, ...rest) {}`,
    },
    {
      name: "skip functions starting with underscore",
      code: `function _internalFunction(param1, param2, param3) {}`,
    },
    {
      name: "skip functions containing a dollar sign",
      code: `function $libraryFunction(param1, param2, param3) {}`,
    },
    {
      name: "skip PascalCase function declarations",
      code: `function Component(props, context, ref) {}`,
    },
    {
      name: "skip PascalCase arrow components",
      code: `const MyComponent = (props, ref, extra) => null;`,
    },
    {
      name: "skip PascalCase function expression components",
      code: `const MyComponent = function (props, ref, extra) { return null; };`,
    },
    {
      name: "forEach callbacks are ignored",
      code: `words.forEach((word, wordIndex, words) => {})`,
    },
    {
      name: "reduce callbacks are ignored",
      code: `items.reduce((acc, curr, index) => {})`,
    },
    {
      name: "function expression callbacks are ignored",
      code: `items.forEach(function (item, index, items) {})`,
    },
    {
      name: "raising the threshold allows three parameters",
      code: `function foo(a, b, c) {}`,
      options: [{ minParams: 4 }],
    },
    {
      name: "skip files inside node_modules",
      code: `function foo(a, b, c) {}`,
      filename: "/project/src/node_modules_shim.ts",
    },
    {
      name: "skip declaration files",
      code: `function foo(a, b, c) {}`,
      filename: "/project/src/types.d.ts",
    },
  ],
  invalid: [
    {
      name: "default-exported arrow with three positional parameters",
      code: `export default (oneParam, twoParam, threeParam) => {};`,
      errors: [{ messageId: "preferDestructuring" }],
    },
    {
      name: "three positional parameters",
      code: `function foo(oneParam, twoParam, threeParam) {}`,
      errors: [{ messageId: "preferDestructuring" }],
    },
    {
      name: "three positional arrow parameters",
      code: `const foo = (oneParam, twoParam, threeParam) => {}`,
      errors: [{ messageId: "preferDestructuring" }],
    },
    {
      name: "mixed destructured and positional parameters",
      code: `function foo({ oneParam }, twoParam, threeParam) {}`,
      errors: [{ messageId: "preferDestructuring" }],
    },
    {
      name: "class method with three positional parameters",
      code: `class MyClass { foo(a, b, c) {} }`,
      errors: [{ messageId: "preferDestructuring" }],
    },
    {
      name: "lowering the threshold flags two parameters",
      code: `function foo(oneParam, twoParam) {}`,
      options: [{ minParams: 2 }],
      errors: [{ messageId: "preferDestructuring" }],
    },
  ],
});
