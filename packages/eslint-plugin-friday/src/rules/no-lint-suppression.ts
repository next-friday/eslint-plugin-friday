import { createRule } from "../core/create-rule.js";

type NoLintSuppressionOptions = never[];

type NoLintSuppressionMessageIds =
  | "tsIgnore"
  | "tsExpectError"
  | "tsNocheck"
  | "eslintDisable"
  | "eslintDisableLine"
  | "eslintDisableNextLine"
  | "prettierIgnore";

export default createRule<
  NoLintSuppressionOptions,
  NoLintSuppressionMessageIds
>({
  name: "no-lint-suppression",
  meta: {
    type: "problem",
    docs: {
      description: "Ban lint suppression comments",
    },
    messages: {
      tsIgnore:
        "Unexpected @ts-ignore directive. Fix the underlying type error instead.",
      tsExpectError:
        "Unexpected @ts-expect-error directive. Fix the underlying type error instead.",
      tsNocheck:
        "Unexpected @ts-nocheck directive. Fix the underlying type errors instead.",
      eslintDisable:
        "Unexpected eslint-disable directive. Fix the underlying lint error or scope the exception in configuration.",
      eslintDisableLine:
        "Unexpected eslint-disable-line directive. Fix the underlying lint error or scope the exception in configuration.",
      eslintDisableNextLine:
        "Unexpected eslint-disable-next-line directive. Fix the underlying lint error or scope the exception in configuration.",
      prettierIgnore:
        "Unexpected prettier-ignore directive. Fix the underlying formatting issue instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;
    const comments = sourceCode.getAllComments();

    const TS_IGNORE_REGEX = /@ts-ignore\b/g;
    const TS_EXPECT_ERROR_REGEX = /@ts-expect-error\b/g;
    const TS_NOCHECK_REGEX = /@ts-nocheck\b/g;
    const ESLINT_DISABLE_REGEX =
      /\beslint-disable\b(?!-line\b)(?!-next-line\b)/g;
    const ESLINT_DISABLE_LINE_REGEX = /\beslint-disable-line\b/g;
    const ESLINT_DISABLE_NEXT_LINE_REGEX = /\beslint-disable-next-line\b/g;
    const PRETTIER_IGNORE_REGEX = /\bprettier-ignore\b/g;

    const SUPPRESSION_PATTERNS = [
      { regex: TS_IGNORE_REGEX, messageId: "tsIgnore" as const },
      { regex: TS_EXPECT_ERROR_REGEX, messageId: "tsExpectError" as const },
      { regex: TS_NOCHECK_REGEX, messageId: "tsNocheck" as const },
      { regex: ESLINT_DISABLE_REGEX, messageId: "eslintDisable" as const },
      {
        regex: ESLINT_DISABLE_LINE_REGEX,
        messageId: "eslintDisableLine" as const,
      },
      {
        regex: ESLINT_DISABLE_NEXT_LINE_REGEX,
        messageId: "eslintDisableNextLine" as const,
      },
      { regex: PRETTIER_IGNORE_REGEX, messageId: "prettierIgnore" as const },
    ] as const;

    for (const comment of comments) {
      const value = comment.value;

      for (const { regex, messageId } of SUPPRESSION_PATTERNS) {
        let match;
        while ((match = regex.exec(value)) !== null) {
          const startIndex = comment.range[0] + match.index + 2;
          const loc = sourceCode.getLocFromIndex(startIndex);

          context.report({
            loc,
            messageId,
          });
        }
      }
    }

    return {};
  },
});
