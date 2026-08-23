import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import {
  compareNames,
  getObjectTypeMembers,
  getPropertySignatures,
  hasGroupComment,
  partitionByOptional,
} from "../fixers/sorting.js";
import { createRule } from "../core/create-rule.js";

type IdentifierProperty = TSESTree.TSPropertySignature & {
  key: TSESTree.Identifier;
};

const isGroupSorted = (group: readonly IdentifierProperty[]): boolean =>
  group.every(
    (property, index) =>
      index === 0 ||
      compareNames(group[index - 1].key.name, property.key.name) <= 0,
  );

const byName = (a: IdentifierProperty, b: IdentifierProperty): number =>
  compareNames(a.key.name, b.key.name);

const isAlphabeticallySortedWithinGroups = (
  members: readonly TSESTree.TypeElement[],
): boolean => {
  const properties = getPropertySignatures(members);

  if (properties.length < 2) {
    return true;
  }

  const { required, optional } = partitionByOptional(properties);

  return isGroupSorted(required) && isGroupSorted(optional);
};

const fixMembers = (
  fixer: TSESLint.RuleFixer,
  members: readonly TSESTree.TypeElement[],
  sourceCode: Readonly<TSESLint.SourceCode>,
): TSESLint.RuleFix[] => {
  const properties = getPropertySignatures(members);

  if (hasGroupComment(properties, sourceCode)) {
    return [];
  }

  const { required, optional } = partitionByOptional(properties);

  const sortedRequired = required.toSorted(byName);
  const sortedOptional = optional.toSorted(byName);

  let requiredIndex = 0;
  let optionalIndex = 0;

  return properties
    .map((property) => {
      const replacement = property.optional
        ? sortedOptional[optionalIndex++]
        : sortedRequired[requiredIndex++];

      return { property, sortedText: sourceCode.getText(replacement) };
    })
    .filter(
      ({ property, sortedText }) => sourceCode.getText(property) !== sortedText,
    )
    .map(({ property, sortedText }) => fixer.replaceText(property, sortedText));
};

export default createRule({
  name: "sort-type-alphabetically",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce alphabetical sorting of properties within required and optional groups in TypeScript interfaces and type aliases",
    },
    fixable: "code",
    messages: {
      unsortedTypeMembers:
        "Type members should be sorted alphabetically within their required and optional groups.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;

    const check = (
      node: TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration,
    ): void => {
      const members = getObjectTypeMembers(node);

      if (
        members === undefined ||
        isAlphabeticallySortedWithinGroups(members)
      ) {
        return;
      }

      context.report({
        node,
        messageId: "unsortedTypeMembers",
        fix: (fixer) => fixMembers(fixer, members, sourceCode),
      });
    };

    return {
      TSInterfaceDeclaration: check,
      TSTypeAliasDeclaration: check,
    };
  },
});
