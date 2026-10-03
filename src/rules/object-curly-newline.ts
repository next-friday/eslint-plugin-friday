import type {AST, Rule} from "eslint";

import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const REQUIRE_MULTILINE = "requireMultiline";

type ObjectExpressionNode = Rule.Node & {
  properties: Rule.Node[];
};

/**
 * Enforce multiline braces for every non-empty object literal.
 * @param context Active ESLint rule context.
 * @param node Object expression to validate.
 */
function checkObjectExpression(context: Rule.RuleContext, node: ObjectExpressionNode): void {
  if (node.properties.length === 0) {
    return;
  }

  const openingBrace = context.sourceCode.getFirstToken(node) as AST.Token;
  const closingBrace = context.sourceCode.getLastToken(node) as AST.Token;
  const firstContent = context.sourceCode.getTokenAfter(openingBrace, {
    includeComments: true,
  }) as AST.Token;
  const lastContent = context.sourceCode.getTokenBefore(closingBrace, {
    includeComments: true,
  }) as AST.Token;
  const shouldAddOpeningNewline = firstContent.loc.start.line === openingBrace.loc.end.line;
  const shouldAddClosingNewline = lastContent.loc.end.line === closingBrace.loc.start.line;

  if (!shouldAddOpeningNewline && !shouldAddClosingNewline) {
    return;
  }

  context.report({
    messageId: REQUIRE_MULTILINE,
    node,
    fix(fixer) {
      const fixes: Rule.Fix[] = [];

      if (shouldAddOpeningNewline) {
        fixes.push(fixer.insertTextAfter(openingBrace, "\n"));
      }

      if (shouldAddClosingNewline) {
        fixes.push(fixer.insertTextBefore(closingBrace, "\n"));
      }

      return fixes;
    },
  });
}

export const objectCurlyNewline: Rule.RuleModule = {
  create(context) {
    return {
      ObjectExpression(node) {
        checkObjectExpression(context, node as ObjectExpressionNode);
      },
    };
  },
  meta: {
    languages: ["js/js"],
    type: "layout",
    docs: {
      description: "require every non-empty object literal to use multiline braces",
      url: getRuleDocumentationUrl("object-curly-newline"),
    },
    fixable: "whitespace",
    messages: {
      [REQUIRE_MULTILINE]: "Non-empty object literals must use multiline braces.",
    },
    schema: [],
  },
};
