import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { hasPrefixBoundary } from "../text/casing.js";
import { BANNED_SERVICE_PREFIXES } from "../constants/banned-service-prefixes.js";
import { createRule } from "../core/create-rule.js";

export default createRule({
  name: "no-misleading-service-prefix",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow misleading function name prefixes in *.service.ts files",
    },
    messages: {
      bannedPrefix:
        "Avoid '{{ prefix }}' prefix in service functions. Rename '{{ name }}' to use a more descriptive prefix (e.g. {{ suggestions }}).",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!context.filename.endsWith(".service.ts")) {
      return {};
    }

    const checkFunctionName = (name: string, node: TSESTree.Node): void => {
      const matchedPrefix = Object.keys(BANNED_SERVICE_PREFIXES).find(
        (prefix) =>
          name.length > prefix.length && hasPrefixBoundary(name, prefix),
      );

      if (matchedPrefix) {
        context.report({
          node,
          messageId: "bannedPrefix",
          data: {
            prefix: matchedPrefix,
            name,
            suggestions: BANNED_SERVICE_PREFIXES[matchedPrefix].join(", "),
          },
        });
      }
    };

    const checkExportedFunction = (
      node: TSESTree.FunctionDeclaration | TSESTree.ArrowFunctionExpression,
      id: TSESTree.Identifier | null,
    ): void => {
      if (!id || !node.async) {
        return;
      }

      checkFunctionName(id.name, id);
    };

    return {
      ExportNamedDeclaration(node) {
        if (
          node.declaration?.type === AST_NODE_TYPES.FunctionDeclaration &&
          node.declaration.id
        ) {
          checkExportedFunction(node.declaration, node.declaration.id);
        }

        if (node.declaration?.type === AST_NODE_TYPES.VariableDeclaration) {
          for (const declarator of node.declaration.declarations) {
            if (
              declarator.id.type === AST_NODE_TYPES.Identifier &&
              declarator.init?.type === AST_NODE_TYPES.ArrowFunctionExpression
            ) {
              checkExportedFunction(declarator.init, declarator.id);
            }
          }
        }
      },
    };
  },
});
