import {RuleTester} from "eslint";
import {parser as typescriptParser} from "typescript-eslint";
import {describe, it} from "vitest";

import {jsxNewlineBetweenElements} from "../../src/rules/jsx-newline-between-elements";

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

const multilineSiblingSource = [
  COMPONENT_OPEN,
  "  return (",
  "    <main>",
  "      <Image",
  '        alt="Logo"',
  '        src="/logo.svg"',
  "      />",
  "      <section>Content</section>",
  "    </main>",
  "  );",
  "}",
  "",
].join("\n");

const multilineSiblingOutput = multilineSiblingSource.replace(
  "      />\n      <section>",
  "      />\n\n      <section>",
);

const singleThenMultilineSource = [
  COMPONENT_OPEN,
  "  return (",
  "    <main>",
  "      <section>Content</section>",
  "      <Image",
  '        alt="Logo"',
  '        src="/logo.svg"',
  "      />",
  "    </main>",
  "  );",
  "}",
  "",
].join("\n");

const singleThenMultilineOutput = singleThenMultilineSource.replace(
  "      <section>Content</section>\n      <Image",
  "      <section>Content</section>\n\n      <Image",
);

const expressionSource = [
  COMPONENT_OPEN,
  "  const show = true;",
  "  return (",
  "    <div>",
  "      {show && (",
  "        <section>",
  "          Content",
  "        </section>",
  "      )}",
  "      <footer>Footer</footer>",
  "    </div>",
  "  );",
  "}",
  "",
].join("\n");

const expressionOutput = expressionSource.replace(
  "      )}\n      <footer>",
  "      )}\n\n      <footer>",
);

const visibleTextBoundarySource = [
  COMPONENT_OPEN,
  "  return (",
  "    <div>",
  "      <section>",
  "        One",
  "      </section>",
  "      Read more",
  "      <aside>",
  "        Two",
  "      </aside>",
  "    </div>",
  "  );",
  "}",
  "",
].join("\n");

const nonBreakingSpaceBoundarySource = [
  COMPONENT_OPEN,
  "  return (",
  "    <div>",
  "      <section>",
  "        One",
  "      </section>\u{A0}<aside>Two</aside>",
  "    </div>",
  "  );",
  "}",
  "",
].join("\n");

ruleTester.run("jsx-newline-between-elements", jsxNewlineBetweenElements, {
  valid: [
    {
      code: compactTextFlow,
      filename,
      name: "keeps text flow compact",
    },
    {
      code: visibleTextBoundarySource,
      filename,
      name: "keeps visible text as a sibling boundary",
    },
    {
      code: nonBreakingSpaceBoundarySource,
      filename,
      name: "preserves a non-breaking-space text boundary",
    },
  ],
  invalid: [
    {
      code: multilineSiblingSource,
      errors: [{messageId: "requireNewline"}],
      filename,
      name: "adds a blank line when either adjacent sibling is multi-line",
      output: multilineSiblingOutput,
    },
    {
      code: expressionSource,
      errors: [{messageId: "requireNewline"}],
      filename,
      name: "adds a blank line after a multi-line expression container",
      output: expressionOutput,
    },
    {
      code: singleThenMultilineSource,
      errors: [{messageId: "requireNewline"}],
      filename,
      name: "adds a blank line when only the following sibling is multi-line",
      output: singleThenMultilineOutput,
    },
  ],
});
