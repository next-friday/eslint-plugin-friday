import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import type { FunctionNode } from "../ast/nodes.js";
import { createRule } from "../core/create-rule.js";

const isCallbackFunction = (node: FunctionNode): boolean =>
  node.parent.type === AST_NODE_TYPES.CallExpression;

const DEVELOPER_FUNCTION_PARENT_TYPES = [
  AST_NODE_TYPES.VariableDeclarator,
  AST_NODE_TYPES.AssignmentExpression,
  AST_NODE_TYPES.Property,
  AST_NODE_TYPES.MethodDefinition,
  AST_NODE_TYPES.ExportDefaultDeclaration,
] as const;

const isDeveloperFunction = (node: FunctionNode): boolean => {
  if (node.type === AST_NODE_TYPES.FunctionDeclaration) {
    return true;
  }

  if (isCallbackFunction(node)) {
    return false;
  }

  return (
    DEVELOPER_FUNCTION_PARENT_TYPES as readonly AST_NODE_TYPES[]
  ).includes(node.parent.type);
};

const isExemptName = (name: string): boolean =>
  name.startsWith("_") || name.includes("$") || /^[A-Z][a-zA-Z]*$/.test(name);

const getFunctionName = (node: FunctionNode): string | undefined => {
  if (node.type === AST_NODE_TYPES.FunctionDeclaration && node.id) {
    return node.id.name;
  }

  if (
    (node.type === AST_NODE_TYPES.ArrowFunctionExpression ||
      node.type === AST_NODE_TYPES.FunctionExpression) &&
    node.parent.type === AST_NODE_TYPES.VariableDeclarator &&
    node.parent.id.type === AST_NODE_TYPES.Identifier
  ) {
    return node.parent.id.name;
  }

  return undefined;
};

export default createRule({
  name: "prefer-destructuring-parameters",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce destructuring for functions with multiple parameters",
    },
    messages: {
      preferDestructuring:
        "Functions with multiple parameters should use destructuring",
    },
    schema: [
      {
        type: "object",
        properties: {
          minParams: {
            type: "integer",
            minimum: 2,
            description:
              "Minimum parameter count at which destructuring is required.",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ minParams: 3 }],
  },
  defaultOptions: [{ minParams: 3 }],
  create(context, [{ minParams }]) {
    const checkFunction = (node: FunctionNode): void => {
      const { filename } = context;

      if (filename.includes("node_modules") || filename.includes(".d.ts")) {
        return;
      }

      if (!isDeveloperFunction(node)) {
        return;
      }

      const name = getFunctionName(node);

      if (name && isExemptName(name)) {
        return;
      }

      if (node.params.length < minParams) {
        return;
      }

      const hasNonDestructuredParameters = node.params.some(
        (parameter: TSESTree.Parameter) =>
          parameter.type !== AST_NODE_TYPES.ObjectPattern &&
          parameter.type !== AST_NODE_TYPES.RestElement,
      );

      if (hasNonDestructuredParameters) {
        context.report({ node, messageId: "preferDestructuring" });
      }
    };

    return {
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
    };
  },
});
