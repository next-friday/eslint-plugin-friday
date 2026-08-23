import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { findFirstUnsorted, reorderNodesByText } from "../fixers/sorting.js";
import { createRule } from "../core/create-rule.js";

const GROUP_NAMES = [
  "",
  "external/alias re-export",
  "relative re-export",
  "local export",
] as const;

type ExportEntry = {
  node: TSESTree.ExportNamedDeclaration;
  group: number;
};

const getExportGroup = (node: TSESTree.ExportNamedDeclaration): number => {
  if (!node.source) {
    return 3;
  }

  return node.source.value.startsWith(".") ? 2 : 1;
};

export default createRule({
  name: "sort-exports",
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce a consistent ordering of export groups",
    },
    fixable: "code",
    messages: {
      unsortedExports:
        "Export group '{{current}}' should come before '{{previous}}'. Expected order: external/alias re-exports, relative re-exports, local exports.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;

    const checkOrder = (exports: readonly ExportEntry[]): void => {
      const unsorted = findFirstUnsorted(exports);

      if (!unsorted) {
        return;
      }

      context.report({
        node: unsorted.current.node,
        messageId: "unsortedExports",
        data: {
          current: GROUP_NAMES[unsorted.current.group],
          previous: GROUP_NAMES[unsorted.previous.group],
        },
        fix: (fixer) =>
          reorderNodesByText(
            exports.map((entry) => entry.node),
            exports
              .toSorted((a, b) => a.group - b.group)
              .map((entry) => entry.node),
            sourceCode,
            fixer,
          ),
      });
    };

    return {
      Program(node) {
        let group: ExportEntry[] = [];

        const flush = (): void => {
          if (group.length === 0) {
            return;
          }

          checkOrder(group);
          group = [];
        };

        for (const statement of node.body) {
          if (
            statement.type !== AST_NODE_TYPES.ExportNamedDeclaration ||
            statement.declaration !== null
          ) {
            flush();
            continue;
          }

          group.push({ node: statement, group: getExportGroup(statement) });
        }

        flush();
      },
    };
  },
});
