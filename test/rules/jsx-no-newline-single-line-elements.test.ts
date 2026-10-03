import {RuleTester} from "eslint";
import {parser as typescriptParser} from "typescript-eslint";
import {describe, it} from "vitest";

import {jsxNoNewlineSingleLineElements} from "../../src/rules/jsx-no-newline-single-line-elements";

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
const filename = "jsx-spacing.tsx";
const COMPONENT_OPEN = "export function Component() {";

const siblingSource = [
  COMPONENT_OPEN,
  "  return (",
  "    <div>",
  "      <span>One</span>",
  "",
  "      <span>Two</span>",
  "    </div>",
  "  );",
  "}",
  "",
].join("\n");

const siblingOutput = siblingSource.replace(
  "      <span>One</span>\n\n      <span>Two</span>",
  "      <span>One</span>\n      <span>Two</span>",
);

const fragmentSource = [
  COMPONENT_OPEN,
  "  return (",
  "    <>",
  "      <Header />",
  "",
  "      <Main />",
  "    </>",
  "  );",
  "}",
  "",
].join("\n");

const fragmentOutput = fragmentSource.replace(
  "      <Header />\n\n      <Main />",
  "      <Header />\n      <Main />",
);

const compactTextFlow = [
  COMPONENT_OPEN,
  "  return (",
  "    <p>",
  "      Looking for ...",
  "      <a>Templates</a>",
  "      <a>Learning</a>",
  "    </p>",
  "  );",
  "}",
  "",
].join("\n");

const expressionBetweenSiblings = [
  COMPONENT_OPEN,
  "  const show = true;",
  "  return (",
  "    <div>",
  "      <span>One</span>",
  "",
  "      {show}",
  "",
  "      <span>Two</span>",
  "    </div>",
  "  );",
  "}",
  "",
].join("\n");

const nonBreakingSpaceBoundary = [
  COMPONENT_OPEN,
  "  return (",
  "    <div>",
  "      <span>One</span>",
  "      \u{A0}",
  "      <span>Two</span>",
  "    </div>",
  "  );",
  "}",
  "",
].join("\n");

ruleTester.run("jsx-no-newline-single-line-elements", jsxNoNewlineSingleLineElements, {
  valid: [
    {
      code: compactTextFlow,
      filename,
      name: "keeps compact text flow unchanged",
    },
    {
      code: expressionBetweenSiblings,
      filename,
      name: "keeps blank lines around a non-element sibling unchanged",
    },
    {
      code: nonBreakingSpaceBoundary,
      filename,
      name: "preserves a non-breaking-space text boundary",
    },
  ],
  invalid: [
    {
      code: siblingSource,
      errors: [{messageId: "forbidNewline"}],
      filename,
      name: "removes blank lines between single-line sibling elements",
      output: siblingOutput,
    },
    {
      code: fragmentSource,
      errors: [{messageId: "forbidNewline"}],
      filename,
      name: "applies the same policy inside fragments",
      output: fragmentOutput,
    },
  ],
});
