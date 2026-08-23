import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { capitalize, isPascalCase, hasPrefixBoundary } from "../text/casing.js";
import { isJsxProducingExpression, type FunctionNode } from "../ast/nodes.js";
import { isJsxFile } from "../text/filename.js";
import { ALLOW_OPTION_SCHEMA } from "../constants/allow-option-schema.js";
import { createRule } from "../core/create-rule.js";

const isComponentFunction = (node: FunctionNode): boolean => {
  if (
    node.type === AST_NODE_TYPES.FunctionDeclaration &&
    node.id &&
    isPascalCase(node.id.name)
  ) {
    return true;
  }

  const { parent } = node;
  return (
    parent?.type === AST_NODE_TYPES.VariableDeclarator &&
    parent.id.type === AST_NODE_TYPES.Identifier &&
    isPascalCase(parent.id.name)
  );
};

export default createRule<[{ allow: string[] }], "missingRenderPrefix">({
  name: "render-naming",
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce 'render' prefix for variables that hold or return JSX inside React components",
    },
    messages: {
      missingRenderPrefix:
        "Variable '{{ name }}' holds JSX-producing content inside a component. Rename it to 'render{{ pascalName }}' so the intent is explicit.",
    },
    schema: [ALLOW_OPTION_SCHEMA],
    defaultOptions: [{ allow: [] }],
  },
  defaultOptions: [{ allow: [] }],
  create(context, [{ allow }]) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    const allowed = new Set(allow);
    const componentStack: boolean[] = [];
    const isInsideComponent = (): boolean => componentStack.some(Boolean);
    const pushFunction = (node: FunctionNode): void => {
      componentStack.push(isComponentFunction(node));
    };
    const popFunction = (): void => {
      componentStack.pop();
    };

    return {
      ArrowFunctionExpression: pushFunction,
      FunctionDeclaration: pushFunction,
      FunctionExpression: pushFunction,
      "ArrowFunctionExpression:exit": popFunction,
      "FunctionDeclaration:exit": popFunction,
      "FunctionExpression:exit": popFunction,
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (
          !isInsideComponent() ||
          node.id.type !== AST_NODE_TYPES.Identifier ||
          !node.init
        ) {
          return;
        }

        if (!isJsxProducingExpression(node.init)) {
          return;
        }

        const { name } = node.id;
        if (allowed.has(name) || hasPrefixBoundary(name, "render")) {
          return;
        }

        context.report({
          node: node.id,
          messageId: "missingRenderPrefix",
          data: { name, pascalName: capitalize(name) },
        });
      },
    };
  },
});
