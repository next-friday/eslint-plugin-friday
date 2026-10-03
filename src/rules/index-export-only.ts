import path from "node:path";
import type {Rule} from "eslint";

import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const MESSAGE_ID = "indexExportOnly";

type ProgramNode = Rule.Node & {
  body: ProgramStatement[];
};

type ProgramStatement = {
  declaration?: {type: string} | null;
  directive?: string;
  moduleReference?: {type: string};
  type: string;
};

/**
 * Check whether a named export contains only type declarations or re-exports.
 * @param node Export statement to inspect.
 * @returns Whether the named export is valid for an index barrel.
 */
function isAllowedNamedExport(node: ProgramStatement): boolean {
  return (
    node.declaration === undefined ||
    node.declaration === null ||
    node.declaration.type === "TSInterfaceDeclaration" ||
    node.declaration.type === "TSTypeAliasDeclaration"
  );
}

/**
 * Check whether a top-level statement is valid in an index barrel.
 * @param node Top-level statement to inspect.
 * @returns Whether the statement belongs in an index barrel.
 */
function isAllowedStatement(node: ProgramStatement): boolean {
  switch (node.type) {
    case "ExportAllDeclaration": {
      return true;
    }

    case "ExportDefaultDeclaration": {
      return node.declaration?.type === "Identifier";
    }

    case "ExportNamedDeclaration": {
      return isAllowedNamedExport(node);
    }

    case "ExpressionStatement": {
      return node.directive !== undefined;
    }

    case "ImportDeclaration": {
      return true;
    }

    case "TSImportEqualsDeclaration": {
      return node.moduleReference?.type === "TSExternalModuleReference";
    }

    case "TSInterfaceDeclaration": {
      return true;
    }

    case "TSTypeAliasDeclaration": {
      return true;
    }

    default: {
      return false;
    }
  }
}

/**
 * Check whether a filename belongs to an index barrel.
 * @param filename Filename reported by ESLint.
 * @returns Whether the filename without its final extension is exactly `index`.
 */
function isIndexFile(filename: string): boolean {
  return path.parse(filename).name === "index";
}

export const indexExportOnly: Rule.RuleModule = {
  create(context) {
    if (!isIndexFile(context.filename)) {
      return {};
    }

    const checkProgram = (node: unknown): void => {
      const program = node as ProgramNode;
      let index = 0;

      while (index < program.body.length) {
        const statement = program.body[index] as ProgramStatement;

        index += 1;

        if (!isAllowedStatement(statement)) {
          context.report({
            messageId: MESSAGE_ID,
            node: statement as unknown as Rule.Node,
          });
        }
      }
    };

    return {Program: checkProgram};
  },
  meta: {
    languages: ["js/js"],
    type: "suggestion",
    docs: {
      description:
        "require index files to contain only imports, exports without inline runtime implementation, directives, and type declarations",
      url: getRuleDocumentationUrl("index-export-only"),
    },
    messages: {
      [MESSAGE_ID]:
        "Index files must contain only imports, exports without inline runtime implementation, directives, and type declarations. Move runtime implementation to a dedicated module and export it from the index.",
    },
    schema: [],
  },
};
