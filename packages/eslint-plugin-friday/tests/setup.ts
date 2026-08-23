import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;

export const fixtureCode = (
  strings: TemplateStringsArray,
  ...values: readonly unknown[]
): string =>
  strings.reduce(
    (result, chunk, index) =>
      result + chunk + (index < values.length ? String(values[index]) : ""),
    "",
  );

export const createRuleTester = (isJsx = false): RuleTester =>
  new RuleTester(
    isJsx
      ? {
          languageOptions: {
            parserOptions: {
              ecmaFeatures: { jsx: true },
            },
          },
        }
      : undefined,
  );
