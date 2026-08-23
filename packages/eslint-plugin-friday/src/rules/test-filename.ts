import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { TEST_FILE_SUFFIXES } from "../constants/test-file-suffixes.js";
import { TEST_GLOBALS } from "../constants/test-globals.js";
import { hasAnySuffix, getBasename } from "../text/filename.js";
import { createRule } from "../core/create-rule.js";

const getCalleeRootIdentifier = (
  node: TSESTree.Expression,
): TSESTree.Identifier | undefined => {
  if (node.type === AST_NODE_TYPES.Identifier) {
    return node;
  }

  if (node.type === AST_NODE_TYPES.MemberExpression) {
    return getCalleeRootIdentifier(node.object);
  }

  if (node.type === AST_NODE_TYPES.CallExpression) {
    return getCalleeRootIdentifier(node.callee);
  }

  return undefined;
};

export default createRule({
  name: "test-filename",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce that files containing test code are named *.test.ts or *.test.tsx",
    },
    messages: {
      requireTestFilename:
        "Files containing test code must be named *.test.ts or *.test.tsx.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (hasAnySuffix(getBasename(context.filename), TEST_FILE_SUFFIXES)) {
      return {};
    }

    let isReported = false;

    return {
      CallExpression(node) {
        if (isReported) {
          return;
        }

        const rootIdentifier = getCalleeRootIdentifier(node.callee);

        if (!rootIdentifier || !TEST_GLOBALS.has(rootIdentifier.name)) {
          return;
        }

        isReported = true;
        context.report({ node, messageId: "requireTestFilename" });
      },
    };
  },
});
