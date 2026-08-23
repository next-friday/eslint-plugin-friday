import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { capitalize, isHookName } from "../text/casing.js";
import { hasAnySuffix, getBasename } from "../text/filename.js";
import { createRule } from "../core/create-rule.js";

const HOOK_FILE_SUFFIXES = [".hook.ts", ".hooks.ts"] as const;

type HookMessageId = "missingUsePrefix" | "defaultExportMissingUsePrefix";

export default createRule({
  name: "hook-naming",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce 'use' prefix for functions in *.hook.ts and *.hooks.ts files",
    },
    messages: {
      missingUsePrefix:
        "Custom hook functions must start with 'use'. Rename '{{ name }}' to '{{ suggestion }}'.",
      defaultExportMissingUsePrefix:
        "Default export in hook files must start with 'use'. Rename '{{ name }}' to '{{ suggestion }}'.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!hasAnySuffix(getBasename(context.filename), HOOK_FILE_SUFFIXES)) {
      return {};
    }

    const checkFunctionName = (
      name: string,
      node: TSESTree.Node,
      messageId: HookMessageId,
    ): void => {
      if (isHookName(name)) {
        return;
      }

      context.report({
        node,
        messageId,
        data: { name, suggestion: `use${capitalize(name)}` },
      });
    };

    return {
      ExportNamedDeclaration(node) {
        if (
          node.declaration?.type === AST_NODE_TYPES.FunctionDeclaration &&
          node.declaration.id
        ) {
          checkFunctionName(
            node.declaration.id.name,
            node.declaration.id,
            "missingUsePrefix",
          );
        }

        if (node.declaration?.type === AST_NODE_TYPES.VariableDeclaration) {
          for (const declarator of node.declaration.declarations) {
            if (declarator.id.type === AST_NODE_TYPES.Identifier) {
              checkFunctionName(
                declarator.id.name,
                declarator.id,
                "missingUsePrefix",
              );
            }
          }
        }
      },
      ExportDefaultDeclaration(node) {
        if (node.declaration.type === AST_NODE_TYPES.Identifier) {
          checkFunctionName(
            node.declaration.name,
            node.declaration,
            "defaultExportMissingUsePrefix",
          );
        }

        if (
          node.declaration.type === AST_NODE_TYPES.FunctionDeclaration &&
          node.declaration.id
        ) {
          checkFunctionName(
            node.declaration.id.name,
            node.declaration.id,
            "defaultExportMissingUsePrefix",
          );
        }
      },
    };
  },
});
