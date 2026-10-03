import {ESLint, RuleTester} from "eslint";
import type {Linter} from "eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import {parser as typescriptParser} from "typescript-eslint";
import {describe, expect, it} from "vitest";

import plugin from "../../src/index";
import {objectCurlyNewline} from "../../src/rules/object-curly-newline";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {parser: typescriptParser},
});

ruleTester.run("object-curly-newline", objectCurlyNewline, {
  valid: [
    {
      code: "const value = {};\n",
      filename: "fixture.ts",
      name: "leaves an empty object unchanged",
    },
    {
      code: 'const value = {\n  first: "x",\n};\n',
      filename: "fixture.ts",
      name: "keeps a single-property object on multiple lines",
    },
    {
      code: 'const value = {\n  first: someFunction(\n    "first-argument",\n    "second-argument",\n  ),\n};\n',
      filename: "fixture.ts",
      name: "keeps an inherently multiline single-property object unchanged",
    },
    {
      code: "const value = {\n  // keep this comment\n  first: 1,\n};\n",
      filename: "fixture.ts",
      name: "keeps a commented single-property object multiline",
    },
    {
      code: "const value = {\n  first: 1,\n  second: 2,\n};\n",
      filename: "fixture.ts",
      name: "keeps a multi-property object on multiple lines",
    },
  ],
  invalid: [
    {
      code: "const value = {first: 1};\n",
      errors: [{messageId: "requireMultiline"}],
      filename: "fixture.ts",
      name: "expands a single-property object",
      output: "const value = {\nfirst: 1\n};\n",
    },
    {
      code: "const value = {first: 1, second: 2};\n",
      errors: [{messageId: "requireMultiline"}],
      filename: "fixture.ts",
      name: "expands a multi-property object",
      output: "const value = {\nfirst: 1, second: 2\n};\n",
    },
    {
      code: "const value = {first: 1\n};\n",
      errors: [{messageId: "requireMultiline"}],
      filename: "fixture.ts",
      name: "adds only the missing opening newline",
      output: "const value = {\nfirst: 1\n};\n",
    },
    {
      code: "const value = {\nfirst: 1};\n",
      errors: [{messageId: "requireMultiline"}],
      filename: "fixture.ts",
      name: "adds only the missing closing newline",
      output: "const value = {\nfirst: 1\n};\n",
    },
  ],
});

const fridayRuleConfig: Linter.Config = {
  plugins: {friday: plugin},
  rules: {"friday/object-curly-newline": "error"},
};

it.each([
  {
    configs: [fridayRuleConfig, eslintConfigPrettier],
    name: "after the Friday rule",
  },
  {
    configs: [eslintConfigPrettier, fridayRuleConfig],
    name: "before the Friday rule",
  },
])("keeps the rule active with eslint-config-prettier $name", async ({configs}) => {
  const eslint = new ESLint({
    fix: true,
    overrideConfig: configs,
    overrideConfigFile: true,
  });

  const [result] = await eslint.lintText("const value = {first: 1};\n", {
    filePath: "fixture.js",
  });

  expect(result?.output).toBe("const value = {\nfirst: 1\n};\n");
});
