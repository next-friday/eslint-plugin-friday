import {
  AST_NODE_TYPES,
  type TSESLint,
  type TSESTree,
} from "@typescript-eslint/utils";

export const compareNames = (a: string, b: string): number =>
  a.localeCompare(b);

export const compareText = (a: string, b: string): number =>
  Number(a > b) - Number(a < b);

export const findFirstUnsorted = <T extends { group: number }>(
  entries: readonly T[],
  compare: (a: T, b: T) => number = (a, b) => a.group - b.group,
): { current: T; previous: T } | undefined => {
  const index = entries.findIndex(
    (entry, position) =>
      position > 0 && compare(entry, entries[position - 1]) < 0,
  );

  if (index === -1) {
    return undefined;
  }

  return { current: entries[index], previous: entries[index - 1] };
};

const isMemberSeparator = (token: TSESTree.Token): boolean =>
  token.value === "," || token.value === ";";

const nodeHasComment = (
  node: TSESTree.Node,
  sourceCode: Readonly<TSESLint.SourceCode>,
): boolean => {
  if (
    sourceCode.getCommentsBefore(node).length > 0 ||
    sourceCode.getCommentsAfter(node).length > 0
  ) {
    return true;
  }

  const after = sourceCode.getTokenAfter(node);
  return (
    after !== null &&
    isMemberSeparator(after) &&
    sourceCode.getCommentsAfter(after).length > 0
  );
};

export const groupHasComment = (
  nodes: readonly TSESTree.Node[],
  sourceCode: Readonly<TSESLint.SourceCode>,
): boolean => nodes.some((node) => nodeHasComment(node, sourceCode));

export const reorderNodesByText = (
  nodes: readonly TSESTree.Node[],
  sorted: readonly TSESTree.Node[],
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
): TSESLint.RuleFix[] => {
  if (groupHasComment(nodes, sourceCode)) {
    return [];
  }

  const sortedTexts = sorted.map((node) => sourceCode.getText(node));

  return nodes
    .map((node, index) => ({ node, sortedText: sortedTexts[index] }))
    .filter(({ node, sortedText }) => sourceCode.getText(node) !== sortedText)
    .map(({ node, sortedText }) => fixer.replaceText(node, sortedText));
};

const isIdentifierPropertySignature = (
  member: TSESTree.TypeElement,
): member is TSESTree.TSPropertySignature & {
  key: TSESTree.Identifier;
} =>
  member.type === AST_NODE_TYPES.TSPropertySignature &&
  member.key.type === AST_NODE_TYPES.Identifier;

export const getPropertySignatures = (
  members: readonly TSESTree.TypeElement[],
): (TSESTree.TSPropertySignature & { key: TSESTree.Identifier })[] =>
  members.filter(isIdentifierPropertySignature);

export const getObjectTypeMembers = (
  node: TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration,
): TSESTree.TypeElement[] | undefined => {
  if (node.type === AST_NODE_TYPES.TSInterfaceDeclaration) {
    return node.body.body;
  }

  if (node.typeAnnotation.type === AST_NODE_TYPES.TSTypeLiteral) {
    return node.typeAnnotation.members;
  }

  return undefined;
};

export const partitionByOptional = <T extends { optional?: boolean }>(
  properties: readonly T[],
): { required: T[]; optional: T[] } => ({
  required: properties.filter((property) => !property.optional),
  optional: properties.filter((property) => property.optional),
});
