import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { hasInlineObjectLiteralTypeNode } from "../ast/nodes.js";
import { createRule } from "../core/create-rule.js";

export default createRule({
  name: "no-nested-interface-declaration",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow inline object type literals in interface or type properties",
    },
    messages: {
      noNestedInterface:
        "Extract nested object type into a separate interface or type declaration",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const reportInlineLiterals = (typeNode: TSESTree.TypeNode): void => {
      if (typeNode.type === AST_NODE_TYPES.TSTypeLiteral) {
        context.report({
          node: typeNode,
          messageId: "noNestedInterface",
        });
        return;
      }

      if (typeNode.type === AST_NODE_TYPES.TSUnionType) {
        for (const member of typeNode.types) {
          if (hasInlineObjectLiteralTypeNode(member)) {
            reportInlineLiterals(member);
          }
        }
      }
    };

    return {
      TSPropertySignature(node) {
        if (!node.typeAnnotation) {
          return;
        }

        const { typeAnnotation } = node.typeAnnotation;

        if (typeAnnotation.type === AST_NODE_TYPES.TSTypeLiteral) {
          context.report({
            node: typeAnnotation,
            messageId: "noNestedInterface",
          });
          return;
        }

        if (typeAnnotation.type === AST_NODE_TYPES.TSArrayType) {
          if (
            typeAnnotation.elementType.type === AST_NODE_TYPES.TSTypeLiteral
          ) {
            context.report({
              node: typeAnnotation.elementType,
              messageId: "noNestedInterface",
            });
          }
          return;
        }

        if (
          typeAnnotation.type === AST_NODE_TYPES.TSTypeReference &&
          typeAnnotation.typeArguments
        ) {
          for (const parameter of typeAnnotation.typeArguments.params) {
            if (parameter.type === AST_NODE_TYPES.TSTypeLiteral) {
              context.report({
                node: parameter,
                messageId: "noNestedInterface",
              });
            }
          }
          return;
        }

        if (typeAnnotation.type === AST_NODE_TYPES.TSUnionType) {
          reportInlineLiterals(typeAnnotation);
        }
      },
    };
  },
});
