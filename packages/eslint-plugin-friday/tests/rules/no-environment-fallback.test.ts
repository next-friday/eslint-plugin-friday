import rule from "../../src/rules/no-environment-fallback.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("no-environment-fallback", rule, {
  valid: [
    {
      name: "allows reading an environment variable without fallback",
      code: `const apiKey = process.env.API_KEY;`,
    },
    {
      name: "allows reading import.meta.env without fallback",
      code: `const mode = import.meta.env.MODE;`,
    },
    {
      name: "allows an environment variable as an if condition",
      code: `if (process.env.NODE_ENV) { console.log("configured"); }`,
    },
    {
      name: "allows a ternary selecting between implementations",
      code: `const logger = process.env.DEBUG ? debugLogger : productionLogger;`,
    },
    {
      name: "allows a Vite dev-mode component switch",
      code: `const component = import.meta.env.DEV ? DevComponent : ProdComponent;`,
    },
    {
      name: "allows a ternary statement calling either function",
      code: `process.env.DEBUG ? enableDebug() : disableDebug();`,
    },
    {
      name: "allows short-circuit feature flag invocation",
      code: `process.env.FEATURE_FLAG && enableFeature();`,
    },
    {
      name: "allows comparing an environment variable",
      code: `process.env.VALUE === "enabled";`,
    },
    {
      name: "allows destructuring without defaults",
      code: `const { DATABASE_URL, API_URL } = process.env;`,
    },
    {
      name: "allows renamed destructuring without defaults",
      code: `const { DATABASE_URL: databaseUrl } = process.env;`,
    },
    {
      name: "allows rest destructuring without defaults",
      code: `const { ...rest } = process.env;`,
    },
    {
      name: "allows nullish coalescing on a non-environment value",
      code: `const value = someVariable ?? "default";`,
    },
    {
      name: "allows logical OR on a non-environment object",
      code: `const href = window.location.href || "/";`,
    },
    {
      name: "allows bracketed access with a variable named env",
      code: `const value = process[env].API_KEY ?? "default";`,
    },
    {
      name: "allows logical AND assignment on an environment variable",
      code: `process.env.DEBUG &&= "1";`,
    },
    {
      name: "allows new.target which is not import.meta",
      code: `class Example {
        constructor() {
          const base = new.target.base ?? Example;
        }
      }`,
    },
    {
      name: "allows assigning the environment object itself",
      code: `const envObject = process.env;`,
    },
    {
      name: "allows a type-wrapped read without fallback",
      code: `const apiKey = process.env.API_KEY as string;`,
    },
  ],
  invalid: [
    {
      name: "reports logical OR fallback",
      code: `const apiKey = process.env.API_KEY || "default-key";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports nullish coalescing fallback",
      code: `const dbUrl = process.env.DATABASE_URL ?? "localhost";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports computed property access fallback",
      code: `const dbUrl = process.env["DATABASE_URL"] ?? "localhost";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports import.meta.env fallback",
      code: `const mode = import.meta.env.SOME_OPTION ?? "development";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports a fallback inside an object property",
      code: `const config = {
  apiUrl: process.env.API_URL ?? "https://api.example.com",
};`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports a fallback in a return statement",
      code: `function getConfig() {
  return process.env.CONFIG_PATH || "/default/path";
}`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports an empty string nullish fallback",
      code: `const secret = process.env.SECRET_KEY ?? "";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports a fallback through an as expression",
      code: `const databaseUrl =
  (process.env.DATABASE_URL as string | undefined) ?? "localhost";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports a fallback through a satisfies expression",
      code: `const databaseUrl =
  (process.env.DATABASE_URL satisfies string | undefined) ?? "localhost";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports a fallback through a non-null expression",
      code: `const dbUrl = process.env.DATABASE_URL! ?? "localhost";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports a fallback through a type assertion",
      code: `const dbUrl = <string>process.env.DATABASE_URL || "localhost";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports a fallback through nested wrappers",
      code: `const databaseUrl =
  (process.env.DATABASE_URL! as string | undefined) ?? "localhost";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports logical OR assignment fallback",
      code: `process.env.API_URL ||= "http://localhost:3000";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports logical nullish assignment fallback",
      code: `process.env.API_URL ??= "http://localhost:3000";`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports a destructuring default",
      code: `const { DATABASE_URL = "localhost" } = process.env;`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports an assignment destructuring default",
      code: `({ API_URL = "https://example.com" } = process.env);`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports a renamed destructuring default",
      code: `const { DATABASE_URL: databaseUrl = "localhost" } = process.env;`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports each destructuring default once",
      code: `const {
  API_URL = "https://example.com",
  PORT = "3000",
} = process.env;`,
      errors: [{ messageId: "noEnvFallback" }, { messageId: "noEnvFallback" }],
    },
    {
      name: "reports a destructuring default from import.meta.env",
      code: `const { DEV = "true" } = import.meta.env;`,
      errors: [{ messageId: "noEnvFallback" }],
    },
    {
      name: "reports a destructuring default through a wrapped source",
      code: `const { DATABASE_URL = "localhost" } =
  process.env as Record<string, string>;`,
      errors: [{ messageId: "noEnvFallback" }],
    },
  ],
});
