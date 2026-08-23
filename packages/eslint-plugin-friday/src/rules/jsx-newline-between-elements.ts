import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { hasComment, isMultiLine } from "../ast/jsx.js";
import { createRule } from "../core/create-rule.js";

const SIGNIFICANT_JSX_CHILD_TYPES = [
  AST_NODE_TYPES.JSXElement,
  AST_NODE_TYPES.JSXFragment,
  AST_NODE_TYPES.JSXExpressionContainer,
] as const;

const isSignificantJsxChild = (node: TSESTree.Node): boolean =>
  (SIGNIFICANT_JSX_CHILD_TYPES as readonly AST_NODE_TYPES[]).includes(
    node.type,
  );

export default createRule({
  name: "jsx-newline-between-elements",
  meta: {
    type: "layout",
    docs: {
      description: "Require empty lines between sibling JSX elements",
    },
    fixable: "whitespace",
    messages: {
      requireNewline: "Expected empty line between sibling JSX elements",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    const { sourceCode } = context;

    const checkSiblings = (children: readonly TSESTree.JSXChild[]): void => {
      const elements = children.filter((child) => isSignificantJsxChild(child));

      for (let index = 0; index < elements.length - 1; index += 1) {
        const current = elements[index];
        const next = elements[index + 1];

        if (!isMultiLine(current) && !isMultiLine(next)) {
          continue;
        }

        if (next.loc.start.line - current.loc.end.line >= 2) {
          continue;
        }

        context.report({
          node: next,
          messageId: "requireNewline",
          fix(fixer) {
            const textBetween = sourceCode
              .getText()
              .slice(current.range[1], next.range[0]);

            if (hasComment(textBetween)) {
              return [];
            }

            return fixer.insertTextAfter(current, "\n");
          },
        });
      }
    };

    return {
      JSXElement(node) {
        if (node.children.length > 0) {
          checkSiblings(node.children);
        }
      },
      JSXFragment(node) {
        if (node.children.length > 0) {
          checkSiblings(node.children);
        }
      },
    };
  },
});
