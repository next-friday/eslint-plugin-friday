import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { hasAnySuffix, getBasename } from "../text/filename.js";
import { createRule } from "../core/create-rule.js";

const HOOK_FILE_SUFFIXES = [".hook.ts", ".hooks.ts"] as const;

const isHookName = (name: string): boolean =>
  name.startsWith("use") && name.length > 3 && /^use[A-Z]/.test(name);

export default createRule({
  name: "hook-filename",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce that files exporting custom hooks are named *.hook.ts or *.hooks.ts",
    },
    messages: {
      requireHookFilename:
        "'{{ name }}' is a custom hook and must be exported from a *.hook.ts or *.hooks.ts file.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (hasAnySuffix(getBasename(context.filename), HOOK_FILE_SUFFIXES)) {
      return {};
    }

    const reportIfHook = (name: string, node: TSESTree.Node): void => {
      if (isHookName(name)) {
        context.report({
          node,
          messageId: "requireHookFilename",
          data: { name },
        });
      }
    };

    return {
      ExportNamedDeclaration(node) {
        if (
          node.declaration?.type === AST_NODE_TYPES.FunctionDeclaration &&
          node.declaration.id
        ) {
          reportIfHook(node.declaration.id.name, node.declaration.id);
        }

        if (node.declaration?.type === AST_NODE_TYPES.VariableDeclaration) {
          for (const declarator of node.declaration.declarations) {
            if (
              declarator.id.type === AST_NODE_TYPES.Identifier &&
              declarator.init !== null &&
              (declarator.init.type ===
                AST_NODE_TYPES.ArrowFunctionExpression ||
                declarator.init.type === AST_NODE_TYPES.FunctionExpression)
            ) {
              reportIfHook(declarator.id.name, declarator.id);
            }
          }
        }
      },
      ExportDefaultDeclaration(node) {
        if (
          node.declaration.type === AST_NODE_TYPES.FunctionDeclaration &&
          node.declaration.id !== null
        ) {
          reportIfHook(node.declaration.id.name, node.declaration.id);
        }
      },
    };
  },
});
