import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { isJsxFile } from "../text/filename.js";
import { REACT_RUNTIME_EXPORTS } from "../constants/react-runtime-exports.js";
import { REACT_TYPE_EXPORTS } from "../constants/react-type-exports.js";
import { createRule } from "../core/create-rule.js";

const buildImportStatement = (typeName: string): string =>
  REACT_TYPE_EXPORTS.has(typeName)
    ? `import type { ${typeName} } from "react"`
    : `import { ${typeName} } from "react"`;

const isReactExport = (name: string): boolean =>
  REACT_TYPE_EXPORTS.has(name) || REACT_RUNTIME_EXPORTS.has(name);

export default createRule({
  name: "prefer-react-import-types",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce importing React types and utilities from 'react' instead of using React.X",
    },
    messages: {
      preferDirectImport:
        "Use direct import '{{importStatement}}' instead of 'React.{{typeName}}'",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    if (!isJsxFile(context.filename)) {
      return {};
    }

    return {
      MemberExpression(node) {
        if (!(
          node.object.type === AST_NODE_TYPES.Identifier &&
          node.object.name === "React" &&
          node.property.type === AST_NODE_TYPES.Identifier &&
          isReactExport(node.property.name)
        )) {
          return;
        }

        const typeName = node.property.name;

        context.report({
          node,
          messageId: "preferDirectImport",
          data: { typeName, importStatement: buildImportStatement(typeName) },
        });
      },
      "TSTypeReference > TSQualifiedName": (node: TSESTree.TSQualifiedName) => {
        if (!(
          node.left.type === AST_NODE_TYPES.Identifier &&
          node.left.name === "React" &&
          isReactExport(node.right.name)
        )) {
          return;
        }

        const typeName = node.right.name;

        context.report({
          node,
          messageId: "preferDirectImport",
          data: { typeName, importStatement: buildImportStatement(typeName) },
        });
      },
    };
  },
});
