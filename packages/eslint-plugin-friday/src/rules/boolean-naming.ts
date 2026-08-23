import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { hasAnyPrefixBoundary, capitalize } from "../text/casing.js";
import { ALLOW_OPTION_SCHEMA } from "../constants/allow-option-schema.js";
import { BOOLEAN_PREFIXES } from "../constants/boolean-prefixes.js";
import {
  forEachFunctionParameter,
  hasBooleanTypeAnnotation,
  isBooleanLiteral,
} from "../ast/nodes.js";
import { createRule } from "../core/create-rule.js";

const isBooleanExpression = (node: TSESTree.Expression): boolean => {
  if (isBooleanLiteral(node)) {
    return true;
  }

  if (node.type === AST_NODE_TYPES.UnaryExpression && node.operator === "!") {
    return true;
  }

  if (node.type === AST_NODE_TYPES.BinaryExpression) {
    const comparisonOperators = [
      "===",
      "!==",
      "==",
      "!=",
      "<",
      ">",
      "<=",
      ">=",
      "in",
      "instanceof",
    ];
    return comparisonOperators.includes(node.operator);
  }

  if (node.type === AST_NODE_TYPES.LogicalExpression) {
    return node.operator === "&&" || node.operator === "||";
  }

  return false;
};

export default createRule<[{ allow: string[] }], "missingPrefix">({
  name: "boolean-naming",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce boolean variables and parameters to have a prefix like is, has, should, can, did, will for better readability",
    },
    messages: {
      missingPrefix:
        "Boolean variable '{{name}}' should have a prefix like is, has, should, can, did, or will. Example: 'is{{suggestedName}}' or 'has{{suggestedName}}'.",
    },
    schema: [ALLOW_OPTION_SCHEMA],
    defaultOptions: [{ allow: [] }],
  },
  defaultOptions: [{ allow: [] }],
  create(context, [{ allow }]) {
    const allowed = new Set(allow);

    const checkBooleanNaming = (name: string, node: TSESTree.Node): void => {
      if (allowed.has(name) || hasAnyPrefixBoundary(name, BOOLEAN_PREFIXES)) {
        return;
      }

      context.report({
        node,
        messageId: "missingPrefix",
        data: { name, suggestedName: capitalize(name) },
      });
    };

    const checkParameter = (parameter: TSESTree.Parameter): void => {
      if (
        parameter.type === AST_NODE_TYPES.Identifier &&
        hasBooleanTypeAnnotation(parameter)
      ) {
        checkBooleanNaming(parameter.name, parameter);
        return;
      }

      if (
        parameter.type === AST_NODE_TYPES.AssignmentPattern &&
        parameter.left.type === AST_NODE_TYPES.Identifier &&
        isBooleanLiteral(parameter.right)
      ) {
        checkBooleanNaming(parameter.left.name, parameter.left);
      }
    };

    const checkFunctionParameters = (
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ): void => {
      forEachFunctionParameter(node, checkParameter);
    };

    return {
      VariableDeclarator(node) {
        if (node.id.type !== AST_NODE_TYPES.Identifier) {
          return;
        }

        if (hasBooleanTypeAnnotation(node)) {
          checkBooleanNaming(node.id.name, node.id);
          return;
        }

        if (node.init && isBooleanExpression(node.init)) {
          checkBooleanNaming(node.id.name, node.id);
        }
      },
      FunctionDeclaration: checkFunctionParameters,
      FunctionExpression: checkFunctionParameters,
      ArrowFunctionExpression: checkFunctionParameters,
    };
  },
});
