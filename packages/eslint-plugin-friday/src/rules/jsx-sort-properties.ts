import {
  AST_NODE_TYPES,
  type TSESLint,
  type TSESTree,
} from "@typescript-eslint/utils";

import { groupHasComment } from "../fixers/sorting.js";
import { isJsxFile } from "../text/filename.js";
import { createRule } from "../core/create-rule.js";

const TYPE_GROUP = {
  STRING: 1,
  HYPHENATED_STRING: 2,
  NUMBER_BOOLEAN_NULL: 3,
  EXPRESSION: 4,
  OBJECT_ARRAY: 5,
  FUNCTION: 6,
  JSX: 7,
  SHORTHAND: 8,
} as const;

const EXPRESSION_TYPE_TO_GROUP = new Map<AST_NODE_TYPES, number>([
  [AST_NODE_TYPES.ObjectExpression, TYPE_GROUP.OBJECT_ARRAY],
  [AST_NODE_TYPES.ArrayExpression, TYPE_GROUP.OBJECT_ARRAY],
  [AST_NODE_TYPES.ArrowFunctionExpression, TYPE_GROUP.FUNCTION],
  [AST_NODE_TYPES.FunctionExpression, TYPE_GROUP.FUNCTION],
  [AST_NODE_TYPES.JSXElement, TYPE_GROUP.JSX],
  [AST_NODE_TYPES.JSXFragment, TYPE_GROUP.JSX],
]);

const isHyphenatedName = (node: TSESTree.JSXAttribute): boolean =>
  node.name.type === AST_NODE_TYPES.JSXIdentifier &&
  node.name.name.includes("-");

const getStringGroup = (node: TSESTree.JSXAttribute): number =>
  isHyphenatedName(node) ? TYPE_GROUP.HYPHENATED_STRING : TYPE_GROUP.STRING;

const getExpressionGroup = (
  expression: TSESTree.Expression,
): number | undefined => {
  if (expression.type === AST_NODE_TYPES.Literal) {
    return typeof expression.value === "string"
      ? undefined
      : TYPE_GROUP.NUMBER_BOOLEAN_NULL;
  }

  if (expression.type === AST_NODE_TYPES.TemplateLiteral) {
    return undefined;
  }

  if (
    expression.type === AST_NODE_TYPES.Identifier &&
    expression.name === "undefined"
  ) {
    return TYPE_GROUP.NUMBER_BOOLEAN_NULL;
  }

  return EXPRESSION_TYPE_TO_GROUP.get(expression.type) ?? TYPE_GROUP.EXPRESSION;
};

const getTypeGroup = (node: TSESTree.JSXAttribute): number | undefined => {
  if (node.value === null) {
    return TYPE_GROUP.SHORTHAND;
  }

  if (node.value.type === AST_NODE_TYPES.Literal) {
    return getStringGroup(node);
  }

  if (node.value.type !== AST_NODE_TYPES.JSXExpressionContainer) {
    return undefined;
  }

  const { expression } = node.value;

  if (expression.type === AST_NODE_TYPES.JSXEmptyExpression) {
    return undefined;
  }

  return getExpressionGroup(expression) ?? getStringGroup(node);
};

const hasUnsortedProperties = (
  attributes: TSESTree.JSXOpeningElement["attributes"],
): boolean => {
  let lastGroup = 0;

  return attributes.some((attribute) => {
    if (attribute.type === AST_NODE_TYPES.JSXSpreadAttribute) {
      lastGroup = 0;
      return false;
    }

    const group = getTypeGroup(attribute);
    if (group === undefined) {
      return false;
    }

    if (group < lastGroup) {
      return true;
    }

    lastGroup = group;
    return false;
  });
};

const getSegments = (
  attributes: TSESTree.JSXOpeningElement["attributes"],
): TSESTree.JSXAttribute[][] => {
  const result: TSESTree.JSXAttribute[][] = [];
  let current: TSESTree.JSXAttribute[] = [];

  for (const attribute of attributes) {
    if (attribute.type === AST_NODE_TYPES.JSXSpreadAttribute) {
      if (current.length > 0) {
        result.push(current);
        current = [];
      }
      continue;
    }
    current.push(attribute);
  }

  if (current.length > 0) {
    result.push(current);
  }

  return result;
};

const sortSegment = (
  segment: TSESTree.JSXAttribute[],
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
): TSESLint.RuleFix[] => {
  if (groupHasComment(segment, sourceCode)) {
    return [];
  }

  const sorted = segment.toSorted(
    (a, b) => (getTypeGroup(a) ?? 0) - (getTypeGroup(b) ?? 0),
  );
  const sortedTexts = sorted.map((attribute) => sourceCode.getText(attribute));

  return segment
    .map((attribute, index) => ({ attribute, sortedText: sortedTexts[index] }))
    .filter(
      ({ attribute, sortedText }) =>
        sourceCode.getText(attribute) !== sortedText,
    )
    .map(({ attribute, sortedText }) =>
      fixer.replaceText(attribute, sortedText),
    );
};

export default createRule({
  name: "jsx-sort-properties",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce JSX props are sorted by value type: strings, hyphenated strings, numbers/booleans, expressions, objects/arrays, functions, JSX elements, then shorthand booleans",
    },
    fixable: "code",
    messages: {
      unsortedProps:
        "JSX props should be sorted by value type: strings, hyphenated strings, numbers/booleans/null, expressions, objects/arrays, functions, JSX elements, then shorthand booleans.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    const { sourceCode } = context;

    return {
      JSXOpeningElement(node) {
        if (!hasUnsortedProperties(node.attributes)) {
          return;
        }

        context.report({
          node,
          messageId: "unsortedProps",
          fix: (fixer) =>
            getSegments(node.attributes).flatMap((segment) =>
              sortSegment(segment, sourceCode, fixer),
            ),
        });
      },
    };
  },
});
