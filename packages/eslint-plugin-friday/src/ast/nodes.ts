import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { ARRAY_RETURNING_METHODS } from "../constants/array-returning-methods.js";

export type FunctionNode =
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression
  | TSESTree.ArrowFunctionExpression;

const FUNCTION_NODE_TYPES: ReadonlySet<AST_NODE_TYPES> = new Set([
  AST_NODE_TYPES.FunctionDeclaration,
  AST_NODE_TYPES.FunctionExpression,
  AST_NODE_TYPES.ArrowFunctionExpression,
]);

export const isFunctionNode = (node: TSESTree.Node): node is FunctionNode =>
  FUNCTION_NODE_TYPES.has(node.type);

export const forEachFunctionParameter = (
  node: FunctionNode,
  visit: (parameter: TSESTree.Parameter) => void,
): void => {
  for (const parameter of node.params) {
    visit(parameter);
  }
};

export const hasInlineObjectLiteralTypeNode = (
  node: TSESTree.TypeNode,
): boolean => {
  if (node.type === AST_NODE_TYPES.TSTypeLiteral) {
    return true;
  }

  if (node.type === AST_NODE_TYPES.TSTypeReference && node.typeArguments) {
    return node.typeArguments.params.some((parameter) =>
      hasInlineObjectLiteralTypeNode(parameter),
    );
  }

  if (node.type === AST_NODE_TYPES.TSUnionType) {
    return node.types.some((type) => hasInlineObjectLiteralTypeNode(type));
  }

  return false;
};

type TypeAnnotatedParameter =
  | TSESTree.Identifier
  | TSESTree.ObjectPattern
  | TSESTree.ArrayPattern
  | TSESTree.RestElement;

const TYPE_ANNOTATED_PARAMETER_TYPES = [
  AST_NODE_TYPES.Identifier,
  AST_NODE_TYPES.ObjectPattern,
  AST_NODE_TYPES.ArrayPattern,
  AST_NODE_TYPES.RestElement,
] as const;

const isTypeAnnotatedParameter = (
  parameter: TSESTree.Parameter,
): parameter is TypeAnnotatedParameter =>
  (TYPE_ANNOTATED_PARAMETER_TYPES as readonly AST_NODE_TYPES[]).includes(
    parameter.type,
  );

export const getParameterTypeAnnotation = (
  parameter: TSESTree.Parameter,
): TSESTree.TypeNode | undefined => {
  if (parameter.type === AST_NODE_TYPES.AssignmentPattern) {
    return getParameterTypeAnnotation(parameter.left);
  }

  if (isTypeAnnotatedParameter(parameter)) {
    return parameter.typeAnnotation?.typeAnnotation;
  }

  return undefined;
};

export const isProgramLevelNode = (node: TSESTree.Node): boolean => {
  const { parent } = node;

  if (!parent) {
    return false;
  }

  if (parent.type === AST_NODE_TYPES.Program) {
    return true;
  }

  return (
    parent.type === AST_NODE_TYPES.ExportNamedDeclaration &&
    parent.parent?.type === AST_NODE_TYPES.Program
  );
};

export const isFunctionInitializer = (
  node: TSESTree.Expression | null | undefined,
): node is TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression =>
  node?.type === AST_NODE_TYPES.ArrowFunctionExpression ||
  node?.type === AST_NODE_TYPES.FunctionExpression;

const TRANSPARENT_EXPRESSION_TYPES: ReadonlySet<AST_NODE_TYPES> = new Set([
  AST_NODE_TYPES.TSAsExpression,
  AST_NODE_TYPES.TSSatisfiesExpression,
  AST_NODE_TYPES.TSNonNullExpression,
  AST_NODE_TYPES.TSTypeAssertion,
]);

const unwrapTransparentExpression = (node: TSESTree.Node): TSESTree.Node =>
  TRANSPARENT_EXPRESSION_TYPES.has(node.type)
    ? unwrapTransparentExpression((node as TSESTree.TSAsExpression).expression)
    : node;

export const isEnvironmentObject = (node: TSESTree.Node): boolean => {
  const expression = unwrapTransparentExpression(node);

  if (
    expression.type !== AST_NODE_TYPES.MemberExpression ||
    expression.property.type !== AST_NODE_TYPES.Identifier ||
    expression.property.name !== "env"
  ) {
    return false;
  }

  const { object } = expression;

  if (object.type === AST_NODE_TYPES.Identifier) {
    return object.name === "process";
  }

  return (
    object.type === AST_NODE_TYPES.MetaProperty &&
    object.meta.name === "import" &&
    object.property.name === "meta"
  );
};

export const isEnvironmentAccess = (node: TSESTree.Node): boolean => {
  const expression = unwrapTransparentExpression(node);

  return (
    expression.type === AST_NODE_TYPES.MemberExpression &&
    isEnvironmentObject(expression.object)
  );
};

export const unwrapTSAsExpression = (node: TSESTree.Node): TSESTree.Node =>
  node.type === AST_NODE_TYPES.TSAsExpression
    ? unwrapTSAsExpression(node.expression)
    : node;

export const isGlobalScope = (node: TSESTree.VariableDeclaration): boolean => {
  const { parent } = node;

  if (parent.type === AST_NODE_TYPES.Program) {
    return true;
  }

  return (
    parent.type === AST_NODE_TYPES.ExportNamedDeclaration &&
    parent.parent?.type === AST_NODE_TYPES.Program
  );
};

export const isBooleanLiteral = (node: TSESTree.Expression): boolean =>
  node.type === AST_NODE_TYPES.Literal && typeof node.value === "boolean";

export const hasBooleanTypeAnnotation = (
  node: TSESTree.VariableDeclarator | TSESTree.Parameter,
): boolean => {
  if (
    node.type === AST_NODE_TYPES.Identifier &&
    node.typeAnnotation?.typeAnnotation.type === AST_NODE_TYPES.TSBooleanKeyword
  ) {
    return true;
  }

  if (
    "id" in node &&
    node.id.type === AST_NODE_TYPES.Identifier &&
    node.id.typeAnnotation?.typeAnnotation.type ===
      AST_NODE_TYPES.TSBooleanKeyword
  ) {
    return true;
  }

  return false;
};

export const isJsxProducingExpression = (
  node: TSESTree.Expression,
): boolean => {
  if (
    node.type === AST_NODE_TYPES.JSXElement ||
    node.type === AST_NODE_TYPES.JSXFragment
  ) {
    return true;
  }

  if (node.type === AST_NODE_TYPES.ConditionalExpression) {
    return (
      isJsxProducingExpression(node.consequent) ||
      isJsxProducingExpression(node.alternate)
    );
  }

  if (node.type === AST_NODE_TYPES.LogicalExpression) {
    return isJsxProducingExpression(node.right);
  }

  if (node.type === AST_NODE_TYPES.ArrayExpression) {
    return node.elements.some((element) => {
      if (!element || element.type === AST_NODE_TYPES.SpreadElement) {
        return false;
      }
      return isJsxProducingExpression(element);
    });
  }

  if (
    node.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    node.type === AST_NODE_TYPES.FunctionExpression
  ) {
    return hasJsxFunctionBody(node.body);
  }

  if (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.property.type === AST_NODE_TYPES.Identifier &&
    ARRAY_RETURNING_METHODS.has(node.callee.property.name)
  ) {
    const callback = node.arguments[0];
    if (
      callback &&
      (callback.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        callback.type === AST_NODE_TYPES.FunctionExpression)
    ) {
      return hasJsxFunctionBody(callback.body);
    }
  }

  if (
    node.type === AST_NODE_TYPES.TSAsExpression ||
    node.type === AST_NODE_TYPES.TSSatisfiesExpression
  ) {
    return isJsxProducingExpression(node.expression);
  }

  return false;
};

const hasJsxFunctionBody = (
  body: TSESTree.BlockStatement | TSESTree.Expression,
): boolean => {
  if (body.type !== AST_NODE_TYPES.BlockStatement) {
    return isJsxProducingExpression(body);
  }

  return body.body.some(
    (statement) =>
      statement.type === AST_NODE_TYPES.ReturnStatement &&
      statement.argument !== null &&
      isJsxProducingExpression(statement.argument),
  );
};
