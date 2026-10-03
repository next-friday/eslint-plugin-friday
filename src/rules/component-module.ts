import type {FunctionComponentSemanticNode} from "@eslint-react/core";
import type {Rule} from "eslint";

import {createFunctionComponentVisitor} from "../utils/function-component-visitor";
import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const MESSAGE_ID = "componentModule";

const ALLOWED_MODULE_STATEMENT_TYPES = new Set([
  "ExportAllDeclaration",
  "ImportDeclaration",
  "TSInterfaceDeclaration",
]);

const EXPORT_STATEMENT_TYPES = new Set(["ExportDefaultDeclaration", "ExportNamedDeclaration"]);

type IdentifierLike = {
  name?: string;
  type?: string;
};

type ProgramStatement = {
  declaration?: unknown;
  declarations?: readonly {id?: IdentifierLike}[];
  directive?: string;
  id?: IdentifierLike | null;
  type: string;
};

type RuleOptions = {
  allowDeclarations?: string[];
};

/**
 * Check whether a declaration contains only React function components.
 * @param node Declaration node to evaluate.
 * @param components React function components detected by the React detector.
 * @returns Whether the declaration contains only React function components.
 */
function isAllowedComponentDeclaration(
  node: ProgramStatement,
  components: readonly FunctionComponentSemanticNode[],
): boolean {
  switch (node.type) {
    case "FunctionDeclaration": {
      return components.some(component => Object.is(component.node, node));
    }

    case "VariableDeclaration": {
      return (
        node.declarations !== undefined &&
        node.declarations.length > 0 &&
        node.declarations.every(declarator =>
          components.some(component => Object.is(component.initPath?.[1], declarator)),
        )
      );
    }

    default: {
      return components.some(component => Object.is(component.node, node));
    }
  }
}

/**
 * Check whether a declaration name is explicitly allowed by framework policy.
 * @param node Declaration node to evaluate.
 * @param allowedDeclarations Framework-owned declaration names.
 * @returns Whether every declaration name is allowed.
 */
function isAllowedDeclarationName(
  node: ProgramStatement,
  allowedDeclarations: ReadonlySet<string>,
): boolean {
  switch (node.type) {
    case "FunctionDeclaration": {
      return node.id?.name !== undefined && allowedDeclarations.has(node.id.name);
    }

    case "VariableDeclaration": {
      return (
        node.declarations !== undefined &&
        node.declarations.length > 0 &&
        node.declarations.every(
          declaration =>
            declaration.id?.name !== undefined && allowedDeclarations.has(declaration.id.name),
        )
      );
    }

    default: {
      return false;
    }
  }
}

/**
 * Check whether an export contains only allowed declarations.
 * @param node Export statement to evaluate.
 * @param components React function components detected by the React detector.
 * @param allowedDeclarations Framework-owned declaration names.
 * @returns Whether the export belongs in the component module.
 */
function isAllowedExportStatement(
  node: ProgramStatement,
  components: readonly FunctionComponentSemanticNode[],
  allowedDeclarations: ReadonlySet<string>,
): boolean {
  if (!EXPORT_STATEMENT_TYPES.has(node.type)) {
    return false;
  }

  if (!node.declaration) {
    return true;
  }

  const declaration = node.declaration as ProgramStatement;

  return (
    declaration.type === "TSInterfaceDeclaration" ||
    isAllowedComponentDeclaration(declaration, components) ||
    isAllowedDeclarationName(declaration, allowedDeclarations)
  );
}

/**
 * Check whether the statement is permitted module syntax.
 * @param node Top-level program statement.
 * @returns Whether the statement is an import, re-export, interface, or directive.
 */
function isAllowedModuleSyntax(node: ProgramStatement): boolean {
  return (
    ALLOWED_MODULE_STATEMENT_TYPES.has(node.type) ||
    (node.type === "ExpressionStatement" && node.directive !== undefined)
  );
}

/**
 * Check whether a top-level statement is permitted in a React component module.
 * @param node Top-level program statement.
 * @param components React function components detected by the React detector.
 * @param allowedDeclarations Framework-owned declaration names.
 * @returns Whether the statement belongs in a JSX or TSX component module.
 */
function isAllowedStatement(
  node: ProgramStatement,
  components: readonly FunctionComponentSemanticNode[],
  allowedDeclarations: ReadonlySet<string>,
): boolean {
  return (
    isAllowedModuleSyntax(node) ||
    isAllowedComponentDeclaration(node, components) ||
    isAllowedExportStatement(node, components, allowedDeclarations)
  );
}

export const componentModule: Rule.RuleModule = {
  create(context) {
    const [options] = context.options as [RuleOptions?];
    const allowedDeclarations = new Set(options?.allowDeclarations);

    return createFunctionComponentVisitor(context, (node, components) => {
      let index = 0;

      while (index < node.body.length) {
        const statement = node.body[index] as (typeof node.body)[number];

        index += 1;

        if (!isAllowedStatement(statement, components, allowedDeclarations)) {
          context.report({
            messageId: MESSAGE_ID,
            node: statement,
          });
        }
      }
    });
  },
  meta: {
    languages: ["js/js"],
    type: "suggestion",
    docs: {
      description:
        "require React component modules to contain only imports, directives, export lists or re-exports, TypeScript interfaces, React function components, and explicitly allowed exported declarations",
      url: getRuleDocumentationUrl("component-module"),
    },
    defaultOptions: [{allowDeclarations: []}],
    messages: {
      [MESSAGE_ID]:
        "Move non-component top-level code out of this React component module into a separate module.",
    },
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          allowDeclarations: {
            description: "Framework-owned declaration names allowed in component modules.",
            type: "array",
            uniqueItems: true,
            items: {type: "string"},
          },
        },
      },
    ],
  },
};
