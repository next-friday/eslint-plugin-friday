import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { compareNames, reorderNodesByText } from "../fixers/sorting.js";
import { createRule } from "../core/create-rule.js";

type PropertyInfo = {
  property: TSESTree.Property;
  name: string;
  hasDefault: boolean;
};

const getPropertyName = (property: TSESTree.Property): string | undefined =>
  !property.computed && property.key.type === AST_NODE_TYPES.Identifier
    ? property.key.name
    : undefined;

const hasDefaultValue = (property: TSESTree.Property): boolean =>
  property.value.type === AST_NODE_TYPES.AssignmentPattern;

const collectProperties = (
  properties: TSESTree.ObjectPattern["properties"],
): PropertyInfo[] =>
  properties
    .map((property) => {
      if (property.type === AST_NODE_TYPES.RestElement) {
        return;
      }

      const name = getPropertyName(property);

      if (name === undefined) {
        return;
      }

      return { property, name, hasDefault: hasDefaultValue(property) };
    })
    .filter((info): info is PropertyInfo => info !== undefined);

const sortProperties = (properties: readonly PropertyInfo[]): PropertyInfo[] =>
  properties.toSorted((a, b) => {
    if (a.hasDefault !== b.hasDefault) {
      return a.hasDefault ? -1 : 1;
    }

    return compareNames(a.name, b.name);
  });

export default createRule({
  name: "sort-destructuring",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce alphabetical sorting of destructured properties with defaults first",
    },
    fixable: "code",
    messages: {
      unsortedDestructuring:
        "Destructured properties should be sorted alphabetically. Properties with defaults should come first, sorted alphabetically.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;

    return {
      VariableDeclarator(node) {
        if (node.id.type !== AST_NODE_TYPES.ObjectPattern) {
          return;
        }

        const properties = collectProperties(node.id.properties);

        if (properties.length < 2) {
          return;
        }

        const sorted = sortProperties(properties);

        if (
          properties.every((info, index) => info.name === sorted[index].name)
        ) {
          return;
        }

        context.report({
          node: node.id,
          messageId: "unsortedDestructuring",
          fix: (fixer) =>
            reorderNodesByText(
              properties.map((info) => info.property),
              sorted.map((info) => info.property),
              sourceCode,
              fixer,
            ),
        });
      },
    };
  },
});
