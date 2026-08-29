import rule from "../../src/rules/no-js-files.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("no-js-files", rule, {
  valid: [
    {
      name: "should allow .ts files",
      code: `const message = "Hello World";`,
      filename: "test.ts",
    },
    {
      name: "should allow .tsx files",
      code: `const message = "Hello World";`,
      filename: "test.tsx",
    },
    {
      name: "should allow .mjs files",
      code: `const message = "Hello World";`,
      filename: "test.mjs",
    },
    {
      name: "should allow .cjs files",
      code: `const message = "Hello World";`,
      filename: "test.cjs",
    },
    {
      name: "should allow files without extension",
      code: `const message = "Hello World";`,
      filename: "test",
    },
    {
      name: "should allow .js files in allowList",
      code: `const message = "Hello World";`,
      filename: "next.config.js",
      options: [{ allowList: ["next.config.js"] }],
    },
    {
      name: "should allow .js files matching glob pattern",
      code: `const message = "Hello World";`,
      filename: "eslint.config.js",
      options: [{ allowList: ["*.config.js"] }],
    },
    {
      name: "should allow multiple patterns in allowList",
      code: `const message = "Hello World";`,
      filename: "babel.config.js",
      options: [{ allowList: ["next.config.js", "*.config.js"] }],
    },
  ],
  invalid: [
    {
      name: "should disallow .js files",
      code: `const message = "Hello World";`,
      filename: "test.js",
      errors: [{ messageId: "noJsFiles", line: 1, column: 1 }],
    },
    {
      name: "should disallow .jsx files",
      code: `const message = "Hello World";`,
      filename: "test.jsx",
      errors: [{ messageId: "noJsFiles", line: 1, column: 1 }],
    },
    {
      name: "should disallow .js files in subdirectory",
      code: `const message = "Hello World";`,
      filename: "src/test.js",
      errors: [{ messageId: "noJsFiles", line: 1, column: 1 }],
    },
    {
      name: "should disallow .jsx files in subdirectory",
      code: `const message = "Hello World";`,
      filename: "components/Button.jsx",
      errors: [{ messageId: "noJsFiles", line: 1, column: 1 }],
    },
    {
      name: "should not allow .js files when allowList doesn't match",
      code: `const message = "Hello World";`,
      filename: "test.js",
      options: [{ allowList: ["next.config.js"] }],
      errors: [{ messageId: "noJsFiles", line: 1, column: 1 }],
    },
    {
      name: "should not allow .js files when glob pattern doesn't match",
      code: `const message = "Hello World";`,
      filename: "test.js",
      options: [{ allowList: ["*.config.js"] }],
      errors: [{ messageId: "noJsFiles", line: 1, column: 1 }],
    },
  ],
});
