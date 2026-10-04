import type {FunctionComponentSemanticNode} from "@eslint-react/core";
import type {Rule} from "eslint";

import {createFunctionComponentVisitor} from "../utils/function-component-visitor";
import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const MESSAGE_ID = "componentModule";

const ALLOWED_MODULE_STATEMENT_TYPES = new Set([
  "ExportAllDeclaration",
  "ImportDeclaration",
  "TSInterfaceDeclaration",
  "TSTypeAliasDeclaration",
]);

const COMPONENT_METADATA_PROPERTIES = new Set(["displayName"]);

const EXPORT_STATEMENT_TYPES = new Set(["ExportDefaultDeclaration", "ExportNamedDeclaration"]);

type IdentifierLike = {
  name?: string;
  type?: string;
};

type ExpressionLike = {
  callee?: ExpressionLike;
  computed?: boolean;
  left?: ExpressionLike;
  name?: string;
  object?: ExpressionLike;
  operator?: string;
  property?: ExpressionLike;
  right?: ExpressionLike;
  type: string;
  value?: unknown;
};

type ImportSpecifierLike = {
  imported?: IdentifierLike;
  importKind?: string;
  local?: IdentifierLike;
  type?: string;
};

type ProgramStatement = {
  declaration?: unknown;
  declarations?: readonly {id?: IdentifierLike; init?: ExpressionLike | null}[];
  directive?: string;
  expression?: ExpressionLike;
  id?: IdentifierLike | null;
  importKind?: string;
  name?: string;
  source?: {value?: unknown};
  specifiers?: readonly ImportSpecifierLike[];
  type: string;
};

type ReactBindings = {
  createContextNames: ReadonlySet<string>;
  namespaceNames: ReadonlySet<string>;
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
 * Collect local React bindings needed to recognize component-support declarations.
 * @param statements Top-level program statements.
 * @returns Local createContext and React namespace/default import names.
 */
function getReactBindings(statements: readonly ProgramStatement[]): ReactBindings {
  const createContextNames = new Set<string>();
  const namespaceNames = new Set<string>();

  for (const statement of statements) {
    if (
      statement.type !== "ImportDeclaration" ||
      statement.importKind === "type" ||
      statement.source?.value !== "react"
    ) {
      continue;
    }

    const specifiers = statement.specifiers as readonly ImportSpecifierLike[];

    for (const specifier of specifiers) {
      if (specifier.importKind === "type") {
        continue;
      }

      if (
        specifier.type === "ImportSpecifier" &&
        specifier.imported?.name === "createContext" &&
        specifier.local?.name !== undefined
      ) {
        createContextNames.add(specifier.local.name);
      }

      if (
        (specifier.type === "ImportDefaultSpecifier" ||
          specifier.type === "ImportNamespaceSpecifier") &&
        specifier.local?.name !== undefined
      ) {
        namespaceNames.add(specifier.local.name);
      }
    }
  }

  return {createContextNames, namespaceNames};
}

/**
 * Check whether a declaration is owned directly by the program body or an export wrapper.
 * @param declaration Declaration node to locate.
 * @param statements Top-level program statements.
 * @returns Whether the declaration belongs to module scope.
 */
function isTopLevelDeclaration(
  declaration: unknown,
  statements: readonly ProgramStatement[],
): boolean {
  return statements.some(
    statement =>
      Object.is(statement, declaration) ||
      (EXPORT_STATEMENT_TYPES.has(statement.type) && Object.is(statement.declaration, declaration)),
  );
}

/**
 * Collect module-scope bindings for detected React function components.
 * @param components React function components detected by the React detector.
 * @param statements Top-level program statements.
 * @returns Component bindings that can own component metadata or identifier exports.
 */
function getComponentNames(
  components: readonly FunctionComponentSemanticNode[],
  statements: readonly ProgramStatement[],
): ReadonlySet<string> {
  const names = new Set<string>();

  for (const component of components) {
    const initPath = component.initPath;

    if (initPath === null || !isTopLevelDeclaration(initPath[0], statements)) {
      continue;
    }

    if (initPath.length === 1) {
      const declaration = initPath[0] as unknown as ProgramStatement;

      if (declaration.id?.name !== undefined) {
        names.add(declaration.id.name);
      }

      continue;
    }

    const declarator = initPath[1] as {id: {name: string}};

    names.add(declarator.id.name);
  }

  return names;
}

/**
 * Check whether an expression calls React.createContext through a verified React import.
 * @param expression Candidate initializer.
 * @param reactBindings Local React bindings.
 * @returns Whether the expression is a React createContext call.
 */
function isReactCreateContextCall(
  expression: ExpressionLike | null | undefined,
  reactBindings: ReactBindings,
): boolean {
  if (expression?.type !== "CallExpression") {
    return false;
  }

  const {callee} = expression;

  return callee?.type === "Identifier" &&
    callee.name !== undefined &&
    reactBindings.createContextNames.has(callee.name)
    ? true
    : callee?.type === "MemberExpression" &&
        callee.computed !== true &&
        callee.object?.type === "Identifier" &&
        callee.object.name !== undefined &&
        reactBindings.namespaceNames.has(callee.object.name) &&
        callee.property?.type === "Identifier" &&
        callee.property.name === "createContext";
}

/**
 * Check whether a variable declaration contains only React structural declarations.
 * @param node Declaration node to evaluate.
 * @param reactBindings Local React bindings.
 * @returns Whether every declared value is a React context.
 */
function isAllowedReactStructuralDeclaration(
  node: ProgramStatement,
  reactBindings: ReactBindings,
): boolean {
  return (
    node.type === "VariableDeclaration" &&
    node.declarations !== undefined &&
    node.declarations.length > 0 &&
    node.declarations.every(declaration =>
      isReactCreateContextCall(declaration.init, reactBindings),
    )
  );
}

/**
 * Check whether a top-level statement assigns supported metadata to a detected component.
 * @param node Top-level program statement.
 * @param componentNames Detected local React component names.
 * @returns Whether the statement is supported component metadata.
 */
function isAllowedComponentMetadataStatement(
  node: ProgramStatement,
  componentNames: ReadonlySet<string>,
): boolean {
  if (
    node.type !== "ExpressionStatement" ||
    node.expression?.type !== "AssignmentExpression" ||
    node.expression.operator !== "="
  ) {
    return false;
  }

  const {left, right} = node.expression as ExpressionLike & {
    left: ExpressionLike;
    right: ExpressionLike;
  };

  return (
    left.type === "MemberExpression" &&
    left.computed !== true &&
    left.object?.type === "Identifier" &&
    left.object.name !== undefined &&
    componentNames.has(left.object.name) &&
    left.property?.type === "Identifier" &&
    left.property.name !== undefined &&
    COMPONENT_METADATA_PROPERTIES.has(left.property.name) &&
    right.type === "Literal" &&
    typeof right.value === "string"
  );
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
 * @param componentNames Detected local React component names.
 * @param reactBindings Local React bindings.
 * @param allowedDeclarations Framework-owned declaration names.
 * @returns Whether the export belongs in the component module.
 */
function isAllowedExportStatement(
  node: ProgramStatement,
  components: readonly FunctionComponentSemanticNode[],
  componentNames: ReadonlySet<string>,
  reactBindings: ReactBindings,
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
    declaration.type === "TSTypeAliasDeclaration" ||
    (declaration.type === "Identifier" &&
      declaration.name !== undefined &&
      componentNames.has(declaration.name)) ||
    isAllowedComponentDeclaration(declaration, components) ||
    isAllowedReactStructuralDeclaration(declaration, reactBindings) ||
    isAllowedDeclarationName(declaration, allowedDeclarations)
  );
}

/**
 * Check whether the statement is permitted module syntax.
 * @param node Top-level program statement.
 * @returns Whether the statement is an import, re-export, type declaration, or directive.
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
 * @param componentNames Detected local React component names.
 * @param reactBindings Local React bindings.
 * @param allowedDeclarations Framework-owned declaration names.
 * @returns Whether the statement belongs in a JSX or TSX component module.
 */
function isAllowedStatement(
  node: ProgramStatement,
  components: readonly FunctionComponentSemanticNode[],
  componentNames: ReadonlySet<string>,
  reactBindings: ReactBindings,
  allowedDeclarations: ReadonlySet<string>,
): boolean {
  return (
    isAllowedModuleSyntax(node) ||
    isAllowedComponentDeclaration(node, components) ||
    isAllowedReactStructuralDeclaration(node, reactBindings) ||
    isAllowedComponentMetadataStatement(node, componentNames) ||
    isAllowedExportStatement(node, components, componentNames, reactBindings, allowedDeclarations)
  );
}

export const componentModule: Rule.RuleModule = {
  create(context) {
    const [options] = context.options as [RuleOptions?];
    const allowedDeclarations = new Set(options?.allowDeclarations);

    return createFunctionComponentVisitor(context, (node, components) => {
      const statements = node.body as unknown as ProgramStatement[];
      const componentNames = getComponentNames(components, statements);
      const reactBindings = getReactBindings(statements);

      for (const statement of statements) {
        if (
          !isAllowedStatement(
            statement,
            components,
            componentNames,
            reactBindings,
            allowedDeclarations,
          )
        ) {
          context.report({
            messageId: MESSAGE_ID,
            node: statement as Rule.Node,
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
        "require React component modules to contain only component definitions, component-support declarations, imports, exports, directives, and explicitly allowed framework declarations",
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
