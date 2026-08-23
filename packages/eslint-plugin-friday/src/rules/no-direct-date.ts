import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../core/create-rule.js";

export default createRule({
  name: "no-direct-date",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow direct usage of Date constructor and methods to enforce centralized date utilities",
    },
    messages: {
      noNewDate: "Avoid using 'new Date()'. Use {{ utility }} instead.",
      noDateNow: "Avoid using 'Date.now()'. Use {{ utility }} instead.",
      noDateParse: "Avoid using 'Date.parse()'. Use {{ utility }} instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          utilityName: {
            type: "string",
            description:
              "Name of the date utility to recommend in the report message.",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ utilityName: "a centralized date utility" }],
  },
  defaultOptions: [{ utilityName: "a centralized date utility" }],
  create(context, [{ utilityName }]) {
    return {
      NewExpression(node) {
        if (
          node.callee.type === AST_NODE_TYPES.Identifier &&
          node.callee.name === "Date"
        ) {
          context.report({
            node,
            messageId: "noNewDate",
            data: { utility: utilityName },
          });
        }
      },
      CallExpression(node) {
        if (
          node.callee.type !== AST_NODE_TYPES.MemberExpression ||
          node.callee.object.type !== AST_NODE_TYPES.Identifier ||
          node.callee.object.name !== "Date" ||
          node.callee.property.type !== AST_NODE_TYPES.Identifier
        ) {
          return;
        }

        if (node.callee.property.name === "now") {
          context.report({
            node,
            messageId: "noDateNow",
            data: { utility: utilityName },
          });
        } else if (node.callee.property.name === "parse") {
          context.report({
            node,
            messageId: "noDateParse",
            data: { utility: utilityName },
          });
        }
      },
    };
  },
});
