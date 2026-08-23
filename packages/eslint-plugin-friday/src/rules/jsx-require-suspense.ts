import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { hasAncestor, isNamedJsxElement } from "../ast/jsx.js";
import { createRule } from "../core/create-rule.js";

const isLazyCall = (callee: TSESTree.CallExpression["callee"]): boolean =>
  (callee.type === AST_NODE_TYPES.Identifier && callee.name === "lazy") ||
  (callee.type === AST_NODE_TYPES.MemberExpression &&
    callee.object.type === AST_NODE_TYPES.Identifier &&
    callee.object.name === "React" &&
    callee.property.type === AST_NODE_TYPES.Identifier &&
    callee.property.name === "lazy");

export default createRule({
  name: "jsx-require-suspense",
  meta: {
    type: "problem",
    docs: {
      description: "Require lazy-loaded components to be wrapped in Suspense",
    },
    messages: {
      requireSuspense:
        "Lazy component '{{ name }}' must be wrapped in <Suspense>. Add a Suspense boundary with a fallback prop.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    const lazyComponents = new Set<string>();

    return {
      VariableDeclarator(node) {
        if (
          node.id.type === AST_NODE_TYPES.Identifier &&
          node.init?.type === AST_NODE_TYPES.CallExpression &&
          isLazyCall(node.init.callee)
        ) {
          lazyComponents.add(node.id.name);
        }
      },
      JSXOpeningElement(node) {
        if (node.name.type !== AST_NODE_TYPES.JSXIdentifier) {
          return;
        }

        const componentName = node.name.name;

        if (
          lazyComponents.has(componentName) &&
          !hasAncestor(node, (current) =>
            isNamedJsxElement(current, "Suspense"),
          )
        ) {
          context.report({
            node,
            messageId: "requireSuspense",
            data: { name: componentName },
          });
        }
      },
    };
  },
});
