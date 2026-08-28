import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../core/create-rule.js";

type NoMagicNumbersOptions = {
  ignore: (number | string)[];
  ignoreArrayIndexes: boolean;
  ignoreDefaultValues: boolean;
  ignoreClassFieldInitialValues: boolean;
  enforceConst: boolean;
};

type NoMagicNumbersMessageIds = "noMagicNumber" | "requireConst";

const MAX_ARRAY_LENGTH = 2 ** 32 - 1;

const parentOf = (node: TSESTree.Node): TSESTree.Node =>
  node.parent as TSESTree.Node;

const OBJECT_SAFE_PARENT_TYPES = [
  AST_NODE_TYPES.ObjectExpression,
  AST_NODE_TYPES.Property,
  AST_NODE_TYPES.AssignmentExpression,
] as const;

const normalizeIgnoreValue = (value: number | string): number | bigint =>
  typeof value === "string" ? BigInt(value.slice(0, -1)) : value;

type NumericLiteral = TSESTree.Literal & { value: number | bigint };

const isNumericLiteral = (node: TSESTree.Node): node is NumericLiteral =>
  node.type === AST_NODE_TYPES.Literal &&
  (typeof node.value === "number" || typeof node.value === "bigint");

const isDefaultValue = (node: TSESTree.Node): boolean =>
  node.parent?.type === AST_NODE_TYPES.AssignmentPattern &&
  node.parent.right === node;

const isClassFieldInitialValue = (node: TSESTree.Node): boolean =>
  node.parent?.type === AST_NODE_TYPES.PropertyDefinition &&
  node.parent.value === node;

const isParseIntRadix = (node: TSESTree.Node): boolean => {
  const { parent } = node;

  if (
    parent?.type !== AST_NODE_TYPES.CallExpression ||
    parent.arguments[1] !== node
  ) {
    return false;
  }

  const { callee } = parent;

  if (callee.type === AST_NODE_TYPES.Identifier) {
    return callee.name === "parseInt";
  }

  return (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    callee.object.type === AST_NODE_TYPES.Identifier &&
    callee.object.name === "Number" &&
    callee.property.type === AST_NODE_TYPES.Identifier &&
    callee.property.name === "parseInt"
  );
};

const isJsxNumber = (node: TSESTree.Node): boolean =>
  parentOf(node).type.startsWith("JSX");

const isArrayIndex = (node: TSESTree.Node, value: number | bigint): boolean =>
  node.parent?.type === AST_NODE_TYPES.MemberExpression &&
  node.parent.property === node &&
  (Number.isSafeInteger(value) || typeof value === "bigint") &&
  value >= 0 &&
  value < MAX_ARRAY_LENGTH;

const fullNumberNodeOf = (
  node: NumericLiteral,
): { node: TSESTree.Node; value: number | bigint; raw: string } => {
  if (
    node.parent?.type === AST_NODE_TYPES.UnaryExpression &&
    (node.parent.operator === "-" || node.parent.operator === "+")
  ) {
    return {
      node: node.parent,
      value: node.parent.operator === "-" ? -node.value : node.value,
      raw: `${node.parent.operator}${node.raw}`,
    };
  }

  return { node, value: node.value, raw: String(node.raw) };
};

export default createRule<[NoMagicNumbersOptions], NoMagicNumbersMessageIds>({
  name: "no-magic-numbers",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow magic numbers outside well-known values because unnamed constants hide intent",
    },
    messages: {
      noMagicNumber:
        "Avoid magic number {{raw}}. Extract it into a named constant.",
      requireConst: "Numeric constant declarations must use 'const'.",
    },
    schema: [
      {
        type: "object",
        properties: {
          enforceConst: {
            type: "boolean",
            description: "Require numeric bindings to use const.",
          },
          ignore: {
            type: "array",
            description:
              'Values exempt everywhere, including bigint strings such as "100n".',
            items: {
              anyOf: [
                { type: "number" },
                {
                  type: "string",
                  pattern: "^[+-]?(?:0|[1-9][0-9]*)n$",
                },
              ],
            },
            uniqueItems: true,
          },
          ignoreArrayIndexes: {
            type: "boolean",
            description: "Exempt valid array indexes.",
          },
          ignoreClassFieldInitialValues: {
            type: "boolean",
            description: "Exempt class field initializers.",
          },
          ignoreDefaultValues: {
            type: "boolean",
            description: "Exempt parameter and destructuring defaults.",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        enforceConst: true,
        ignore: [0, 1],
        ignoreArrayIndexes: false,
        ignoreClassFieldInitialValues: false,
        ignoreDefaultValues: false,
      },
    ],
  },
  defaultOptions: [
    {
      enforceConst: true,
      ignore: [0, 1],
      ignoreArrayIndexes: false,
      ignoreClassFieldInitialValues: false,
      ignoreDefaultValues: false,
    },
  ],
  create(context, [options]) {
    const ignored = new Set(
      options.ignore.map((value) => normalizeIgnoreValue(value)),
    );

    return {
      Literal(node) {
        if (!isNumericLiteral(node)) {
          return;
        }

        const fullNumberNode = fullNumberNodeOf(node);

        if (
          fullNumberNode.node.parent?.type === AST_NODE_TYPES.TSEnumMember ||
          fullNumberNode.node.parent?.type === AST_NODE_TYPES.TSLiteralType
        ) {
          return;
        }

        if (
          ignored.has(fullNumberNode.value) ||
          (options.ignoreDefaultValues &&
            isDefaultValue(fullNumberNode.node)) ||
          (options.ignoreClassFieldInitialValues &&
            isClassFieldInitialValue(fullNumberNode.node)) ||
          isParseIntRadix(fullNumberNode.node) ||
          isJsxNumber(fullNumberNode.node) ||
          (options.ignoreArrayIndexes &&
            isArrayIndex(fullNumberNode.node, fullNumberNode.value))
        ) {
          return;
        }

        const parent = parentOf(fullNumberNode.node);

        if (parent.type === AST_NODE_TYPES.VariableDeclarator) {
          if (
            options.enforceConst &&
            (parentOf(parent) as TSESTree.VariableDeclaration).kind !== "const"
          ) {
            context.report({
              node: fullNumberNode.node,
              messageId: "requireConst",
            });
          }
          return;
        }

        if (
          !OBJECT_SAFE_PARENT_TYPES.includes(
            parent.type as (typeof OBJECT_SAFE_PARENT_TYPES)[number],
          ) ||
          (parent.type === AST_NODE_TYPES.AssignmentExpression &&
            parent.left.type === AST_NODE_TYPES.Identifier)
        ) {
          context.report({
            node: fullNumberNode.node,
            messageId: "noMagicNumber",
            data: { raw: fullNumberNode.raw },
          });
        }
      },
    };
  },
});
