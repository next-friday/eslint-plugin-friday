import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { NODE_BUILTINS } from "../constants/node-builtins.js";
import { findFirstUnsorted, reorderNodesByText } from "../fixers/sorting.js";
import { createRule } from "../core/create-rule.js";

const GROUP_NAMES = [
  "",
  "side-effect",
  "builtin",
  "builtin type",
  "external",
  "external type",
  "internal alias",
  "internal alias type",
  "parent relative",
  "parent relative type",
  "relative",
  "relative type",
] as const;

type ImportEntry = {
  node: TSESTree.ImportDeclaration;
  group: number;
};

const isTypeOnlyImport = (node: TSESTree.ImportDeclaration): boolean =>
  node.importKind === "type" && node.specifiers.length > 0;

const getImportGroup = (node: TSESTree.ImportDeclaration): number => {
  const source = node.source.value;
  const isType = isTypeOnlyImport(node);

  if (node.specifiers.length === 0 && !isType) {
    return 1;
  }

  if (
    source.startsWith("node:") ||
    NODE_BUILTINS.has(source.split("/", 1)[0])
  ) {
    return isType ? 3 : 2;
  }

  if (
    source.startsWith("@/") ||
    source.startsWith("~/") ||
    source.startsWith("#")
  ) {
    return isType ? 7 : 6;
  }

  if (source === ".." || source.startsWith("../")) {
    return isType ? 9 : 8;
  }

  if (source.startsWith(".")) {
    return isType ? 11 : 10;
  }

  return isType ? 5 : 4;
};

const getMainGroup = (group: number): number =>
  group === 1 ? 1 : Math.floor((group - 2) / 2) + 2;

export default createRule({
  name: "sort-imports",
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce a consistent ordering of import groups",
    },
    fixable: "code",
    messages: {
      unsortedImports:
        "Import group '{{current}}' should come before '{{previous}}'. Expected order: side-effect, builtin, external, internal alias, parent relative, relative — each followed by its type imports.",
      missingBlankLine:
        "Expected a blank line before '{{current}}' imports (new group after '{{previous}}').",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;

    const checkBlankLines = (imports: readonly ImportEntry[]): void => {
      for (let index = 1; index < imports.length; index += 1) {
        const previous = imports[index - 1];
        const current = imports[index];

        if (getMainGroup(previous.group) === getMainGroup(current.group)) {
          continue;
        }

        if (current.node.loc.start.line - previous.node.loc.end.line > 1) {
          continue;
        }

        context.report({
          node: current.node,
          messageId: "missingBlankLine",
          data: {
            current: GROUP_NAMES[current.group],
            previous: GROUP_NAMES[previous.group],
          },
          fix(fixer) {
            const firstToken = sourceCode.getFirstToken(current.node);
            return fixer.insertTextBefore(firstToken!, "\n");
          },
        });
      }
    };

    const checkOrder = (imports: readonly ImportEntry[]): boolean => {
      const unsorted = findFirstUnsorted(imports);

      if (!unsorted) {
        return false;
      }

      context.report({
        node: unsorted.current.node,
        messageId: "unsortedImports",
        data: {
          current: GROUP_NAMES[unsorted.current.group],
          previous: GROUP_NAMES[unsorted.previous.group],
        },
        fix: (fixer) =>
          reorderNodesByText(
            imports.map((entry) => entry.node),
            imports
              .toSorted((a, b) => a.group - b.group)
              .map((entry) => entry.node),
            sourceCode,
            fixer,
          ),
      });

      return true;
    };

    return {
      Program(node) {
        let group: ImportEntry[] = [];

        const flush = (): void => {
          if (group.length > 0 && !checkOrder(group)) {
            checkBlankLines(group);
          }
          group = [];
        };

        for (const statement of node.body) {
          if (statement.type !== AST_NODE_TYPES.ImportDeclaration) {
            flush();
            continue;
          }

          group.push({ node: statement, group: getImportGroup(statement) });
        }

        flush();
      },
    };
  },
});
