import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import {
  hasInlineObjectLiteralTypeNode,
  type FunctionNode,
} from "../ast/nodes.js";
import { isReactComponentFunction } from "../ast/jsx.js";
import { createRule } from "../core/create-rule.js";

export default createRule({
  name: "prefer-interface-over-inline-types",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce interface declarations over inline type annotations for React component props",
    },
    messages: {
      useInterface:
        "Use interface declaration for component props instead of inline type annotation",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const checkFunction = (node: FunctionNode): void => {
      if (!isReactComponentFunction(node) || node.params.length !== 1) {
        return;
      }

      const parameter = node.params[0];

      if (
        parameter.type !== AST_NODE_TYPES.Identifier ||
        !parameter.typeAnnotation ||
        !hasInlineObjectLiteralTypeNode(parameter.typeAnnotation.typeAnnotation)
      ) {
        return;
      }

      context.report({
        node: parameter.typeAnnotation,
        messageId: "useInterface",
      });
    };

    return {
      ArrowFunctionExpression: checkFunction,
      FunctionExpression: checkFunction,
      FunctionDeclaration: checkFunction,
    };
  },
});
