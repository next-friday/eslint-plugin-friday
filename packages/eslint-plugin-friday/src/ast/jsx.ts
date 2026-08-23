import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

export const isJsxElementOrFragment = (node: TSESTree.Node): boolean =>
  node.type === AST_NODE_TYPES.JSXElement ||
  node.type === AST_NODE_TYPES.JSXFragment;

export const isSingleLine = (node: TSESTree.Node): boolean =>
  node.loc.start.line === node.loc.end.line;

export const isMultiLine = (node: TSESTree.Node): boolean =>
  node.loc.start.line !== node.loc.end.line;

export const isWhitespaceJsxText = (node: TSESTree.JSXChild): boolean =>
  node.type === AST_NODE_TYPES.JSXText && node.value.trim() === "";

export const hasComment = (text: string): boolean =>
  text.includes("//") || text.includes("/*");

export const unwrapTypeAssertion = (
  node: TSESTree.Expression | null,
): TSESTree.Expression | undefined => {
  if (!node) {
    return undefined;
  }

  if (
    node.type === AST_NODE_TYPES.TSAsExpression ||
    node.type === AST_NODE_TYPES.TSSatisfiesExpression
  ) {
    return unwrapTypeAssertion(node.expression);
  }

  return node;
};

export const isNamedJsxElement = (node: TSESTree.Node, name: string): boolean =>
  node.type === AST_NODE_TYPES.JSXElement &&
  node.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier &&
  node.openingElement.name.name === name;

export const hasAncestor = (
  node: TSESTree.Node,
  isMatch: (current: TSESTree.Node) => boolean,
): boolean => {
  let current: TSESTree.Node | undefined = node.parent;

  while (current) {
    if (isMatch(current)) {
      return true;
    }
    current = current.parent;
  }

  return false;
};

const hasJsxConditionalBranch = (
  node: TSESTree.ConditionalExpression,
): boolean =>
  isJsxElementOrFragment(node.consequent) ||
  isJsxElementOrFragment(node.alternate);

const hasJsxLogicalRightOperand = (node: TSESTree.LogicalExpression): boolean =>
  isJsxElementOrFragment(node.right);

const hasJsxReturn = (block: TSESTree.BlockStatement): boolean =>
  block.body.some(
    (statement) =>
      statement.type === AST_NODE_TYPES.ReturnStatement &&
      statement.argument !== null &&
      (isJsxElementOrFragment(statement.argument) ||
        (statement.argument.type === AST_NODE_TYPES.ConditionalExpression &&
          hasJsxConditionalBranch(statement.argument)) ||
        (statement.argument.type === AST_NODE_TYPES.LogicalExpression &&
          hasJsxLogicalRightOperand(statement.argument))),
  );

export const isReactComponentFunction = (
  node:
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionExpression
    | TSESTree.FunctionDeclaration,
): boolean => {
  if (
    node.type === AST_NODE_TYPES.ArrowFunctionExpression &&
    isJsxElementOrFragment(node.body)
  ) {
    return true;
  }

  return (
    node.body.type === AST_NODE_TYPES.BlockStatement && hasJsxReturn(node.body)
  );
};
