import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { unwrapTypeAssertion } from "../ast/jsx.js";
import { createRule } from "../core/create-rule.js";

const isObjectLikeElement = (
  node: TSESTree.Expression | TSESTree.SpreadElement | null,
): boolean => {
  if (!node || node.type === AST_NODE_TYPES.SpreadElement) {
    return false;
  }

  return unwrapTypeAssertion(node)?.type === AST_NODE_TYPES.ObjectExpression;
};

const getArrayInitializer = (
  init: TSESTree.Expression | null,
): TSESTree.ArrayExpression | undefined => {
  const unwrapped = unwrapTypeAssertion(init);
  return unwrapped?.type === AST_NODE_TYPES.ArrayExpression
    ? unwrapped
    : undefined;
};

export default createRule({
  name: "jsx-no-data-array",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow top-level arrays of object literals in .tsx/.jsx files; extract them to a data file",
    },
    messages: {
      noDataArray:
        "Top-level array of object literals belongs in a data file (e.g. *.data.ts), not a .tsx/.jsx component file. Extract '{{ name }}' to a sibling data module.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    const checkDeclarator = (node: TSESTree.VariableDeclarator): void => {
      const arrayInit = getArrayInitializer(node.init);
      if (!arrayInit) {
        return;
      }

      if (
        arrayInit.elements.every((element) => !isObjectLikeElement(element))
      ) {
        return;
      }

      const name =
        node.id.type === AST_NODE_TYPES.Identifier
          ? node.id.name
          : "<destructured>";

      context.report({
        node,
        messageId: "noDataArray",
        data: { name },
      });
    };

    return {
      "Program > VariableDeclaration > VariableDeclarator": checkDeclarator,
      "Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator":
        checkDeclarator,
    };
  },
});
