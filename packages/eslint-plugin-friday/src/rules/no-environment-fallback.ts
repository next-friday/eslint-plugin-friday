import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { isEnvironmentAccess, isEnvironmentObject } from "../ast/nodes.js";
import { ENVIRONMENT_FALLBACK_ASSIGNMENT_OPERATORS } from "../constants/environment-fallback-assignment-operators.js";
import { ENVIRONMENT_FALLBACK_OPERATORS } from "../constants/environment-fallback-operators.js";
import { createRule } from "../core/create-rule.js";

const destructuringDefaults = (
  pattern: TSESTree.ObjectPattern,
): TSESTree.AssignmentPattern[] =>
  pattern.properties.flatMap((property) =>
    property.type === AST_NODE_TYPES.Property &&
    property.value.type === AST_NODE_TYPES.AssignmentPattern
      ? [property.value]
      : [],
  );

export default createRule({
  name: "no-environment-fallback",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow fallback/default values for environment variables because they can hide missing configuration",
    },
    messages: {
      noEnvFallback:
        "Avoid fallback/default values for environment variables because they can hide missing configuration. Validate required configuration explicitly at the application boundary.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      AssignmentExpression(node) {
        if (
          ENVIRONMENT_FALLBACK_ASSIGNMENT_OPERATORS.has(node.operator) &&
          isEnvironmentAccess(node.left)
        ) {
          context.report({ node, messageId: "noEnvFallback" });
          return;
        }

        if (
          node.operator !== "=" ||
          !isEnvironmentObject(node.right) ||
          node.left.type !== AST_NODE_TYPES.ObjectPattern
        ) {
          return;
        }

        for (const fallback of destructuringDefaults(node.left)) {
          context.report({ node: fallback, messageId: "noEnvFallback" });
        }
      },
      LogicalExpression(node) {
        if (
          ENVIRONMENT_FALLBACK_OPERATORS.has(node.operator) &&
          isEnvironmentAccess(node.left)
        ) {
          context.report({ node, messageId: "noEnvFallback" });
        }
      },
      VariableDeclarator(node) {
        if (!node.init || !isEnvironmentObject(node.init)) {
          return;
        }

        if (node.id.type !== AST_NODE_TYPES.ObjectPattern) {
          return;
        }

        for (const fallback of destructuringDefaults(node.id)) {
          context.report({ node: fallback, messageId: "noEnvFallback" });
        }
      },
    };
  },
});
