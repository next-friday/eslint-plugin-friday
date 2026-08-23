import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { unwrapTSAsExpression } from "../ast/nodes.js";
import { createRule } from "../core/create-rule.js";

const isNestedStructure = (node: TSESTree.Node): boolean => {
  const inner = unwrapTSAsExpression(node);

  return (
    inner.type === AST_NODE_TYPES.ObjectExpression ||
    inner.type === AST_NODE_TYPES.ArrayExpression
  );
};

const hasNestedStructure = (
  node: TSESTree.ObjectExpression | TSESTree.ArrayExpression,
): boolean => {
  if (node.type === AST_NODE_TYPES.ObjectExpression) {
    return node.properties.some(
      (property) =>
        property.type === AST_NODE_TYPES.Property &&
        isNestedStructure(property.value),
    );
  }

  return node.elements.some(
    (element) => element !== null && isNestedStructure(element),
  );
};

export default createRule({
  name: "no-inline-nested-object",
  meta: {
    type: "layout",
    docs: {
      description:
        "Require object or array values passed to functions, returned, or used as JSX attributes to span multiple lines when they contain nested objects or arrays",
    },
    fixable: "whitespace",
    messages: {
      requireMultiline:
        "Inline collections containing nested objects or arrays should span multiple lines",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;

    const checkValue = (node: TSESTree.Node | null | undefined): void => {
      if (!node) {
        return;
      }

      const inner = unwrapTSAsExpression(node);

      if (
        inner.type !== AST_NODE_TYPES.ObjectExpression &&
        inner.type !== AST_NODE_TYPES.ArrayExpression
      ) {
        return;
      }

      if (inner.loc.start.line !== inner.loc.end.line) {
        return;
      }

      if (!hasNestedStructure(inner)) {
        return;
      }

      const elements =
        inner.type === AST_NODE_TYPES.ObjectExpression
          ? inner.properties
          : inner.elements;

      context.report({
        node: inner,
        messageId: "requireMultiline",
        fix(fixer) {
          const valueLineText = sourceCode.lines[inner.loc.start.line - 1];
          const lineIndent = /^(\s*)/.exec(valueLineText)![1];
          const innerIndent = `${lineIndent}  `;
          const isObject = inner.type === AST_NODE_TYPES.ObjectExpression;

          const presentElements = elements.filter(
            (element): element is NonNullable<typeof element> =>
              element !== null,
          );

          const openChar = isObject ? "{" : "[";
          const closeChar = isObject ? "}" : "]";
          const closeToken = sourceCode.getLastToken(inner)!;

          const lines: string[] = [];

          for (const element of presentElements) {
            for (const comment of sourceCode.getCommentsBefore(element)) {
              lines.push(`${innerIndent}${sourceCode.getText(comment)}`);
            }
            lines.push(`${innerIndent}${sourceCode.getText(element)},`);
          }

          const trailingComments = sourceCode.getCommentsBefore(closeToken);
          for (const comment of trailingComments) {
            lines.push(`${innerIndent}${sourceCode.getText(comment)}`);
          }

          const formattedElements = lines.join("\n");
          const newContent = `${openChar}\n${formattedElements}\n${lineIndent}${closeChar}`;

          return fixer.replaceText(inner, newContent);
        },
      });
    };

    const checkArguments = (
      arguments_: readonly TSESTree.CallExpressionArgument[],
    ): void => {
      for (const argument of arguments_) {
        if (argument.type !== AST_NODE_TYPES.SpreadElement) {
          checkValue(argument);
        }
      }
    };

    return {
      CallExpression(node) {
        checkArguments(node.arguments);
      },
      NewExpression(node) {
        checkArguments(node.arguments);
      },
      ReturnStatement(node) {
        checkValue(node.argument);
      },
      ArrowFunctionExpression(node) {
        if (node.body.type !== AST_NODE_TYPES.BlockStatement) {
          checkValue(node.body);
        }
      },
      JSXExpressionContainer(node) {
        if (node.expression.type !== AST_NODE_TYPES.JSXEmptyExpression) {
          checkValue(node.expression);
        }
      },
    };
  },
});
