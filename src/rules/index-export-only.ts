import path from "node:path";
import type {Rule} from "eslint";

import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const MESSAGE_ID = "indexExportOnly";

type IdentifierLike = {
  name?: string;
  type?: string;
};

type ExpressionLike = {
  arguments?: ExpressionLike[];
  callee?: ExpressionLike;
  computed?: boolean;
  expression?: ExpressionLike;
  name?: string;
  object?: ExpressionLike;
  properties?: PropertyLike[];
  property?: ExpressionLike;
  type: string;
  value?: unknown;
};

type ModuleSpecifierLike = {
  exportKind?: string;
  exported?: IdentifierLike;
  importKind?: string;
  local?: IdentifierLike;
  type?: string;
};

type PropertyLike = {
  computed?: boolean;
  kind?: string;
  method?: boolean;
  type: string;
  value?: ExpressionLike;
};

type VariableDeclaratorLike = {
  id?: IdentifierLike;
  init?: ExpressionLike | null;
};

type VariableDeclarationLike = {
  declarations?: VariableDeclaratorLike[];
  kind?: string;
  type: string;
};

type ProgramNode = Rule.Node & {
  body: ProgramStatement[];
};

type ProgramStatement = {
  declaration?: VariableDeclarationLike | {type: string} | null;
  declarations?: VariableDeclaratorLike[];
  directive?: string;
  exportKind?: string;
  importKind?: string;
  kind?: string;
  moduleReference?: {type: string};
  source?: {value?: unknown} | null;
  specifiers?: ModuleSpecifierLike[];
  type: string;
};

type CompoundBridge = {
  exportName: string;
  localName: string;
};

const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/u;

/**
 * Check whether an expression is an identifier with a known runtime import binding.
 * @param expression Expression to inspect.
 * @param importedBindings Runtime bindings imported by the index module.
 * @returns Whether the expression references an imported runtime value.
 */
function isImportedIdentifier(
  expression: ExpressionLike | undefined,
  importedBindings: ReadonlySet<string>,
): boolean {
  return (
    expression?.type === "Identifier" &&
    expression.name !== undefined &&
    importedBindings.has(expression.name)
  );
}

/**
 * Check whether an expression is a static public namespace assembled from imported values.
 * @param expression Candidate object expression.
 * @param importedBindings Runtime bindings imported by the index module.
 * @returns Whether the object only exposes imported runtime values.
 */
function isStaticImportedObject(
  expression: ExpressionLike | null | undefined,
  importedBindings: ReadonlySet<string>,
): boolean {
  return (
    expression?.type === "ObjectExpression" &&
    expression.properties !== undefined &&
    expression.properties.length > 0 &&
    expression.properties.every(
      property =>
        property.type === "Property" &&
        property.computed !== true &&
        property.kind === "init" &&
        property.method !== true &&
        isImportedIdentifier(property.value, importedBindings),
    )
  );
}

/**
 * Check whether an expression is a narrow static compound API assembly.
 * @param expression Candidate Object.assign call.
 * @param importedBindings Runtime bindings imported by the index module.
 * @returns Whether the expression only composes imported bindings into a static object.
 */
function isCompoundAssembly(
  expression: ExpressionLike | null | undefined,
  importedBindings: ReadonlySet<string>,
): boolean {
  if (
    expression?.type !== "CallExpression" ||
    expression.callee?.type !== "MemberExpression" ||
    expression.callee.computed === true ||
    expression.callee.object?.type !== "Identifier" ||
    expression.callee.object.name !== "Object" ||
    expression.callee.property?.type !== "Identifier" ||
    expression.callee.property.name !== "assign" ||
    expression.arguments?.length !== 2
  ) {
    return false;
  }

  const [base, staticMembers] = expression.arguments;

  return (
    isImportedIdentifier(base, importedBindings) &&
    staticMembers?.type === "ObjectExpression" &&
    staticMembers.properties !== undefined &&
    staticMembers.properties.length > 0 &&
    staticMembers.properties.every(
      property =>
        property.type === "Property" &&
        property.computed !== true &&
        property.kind === "init" &&
        property.method !== true &&
        isImportedIdentifier(property.value, importedBindings),
    )
  );
}

/**
 * Collect runtime imports available for public API assembly.
 * @param statements Program body statements.
 * @returns Imported runtime binding names.
 */
function getImportedRuntimeBindings(statements: readonly ProgramStatement[]): ReadonlySet<string> {
  const bindings = new Set<string>();

  for (const statement of statements) {
    if (
      statement.type !== "ImportDeclaration" ||
      statement.importKind === "type" ||
      statement.source?.value === undefined
    ) {
      continue;
    }

    const specifiers = statement.specifiers ?? [];

    for (const specifier of specifiers) {
      if (specifier.importKind === "type" || specifier.local?.name === undefined) {
        continue;
      }

      bindings.add(specifier.local.name);
    }
  }

  return bindings;
}

/**
 * Get the single exported const declarator from a named export.
 * @param node Export statement to inspect.
 * @returns The exported declarator when the export has the supported shape.
 */
function getExportedConstDeclarator(node: ProgramStatement): VariableDeclaratorLike | undefined {
  if (node.type !== "ExportNamedDeclaration" || node.declaration?.type !== "VariableDeclaration") {
    return undefined;
  }

  const declaration = node.declaration as VariableDeclarationLike;

  return declaration.kind !== "const" || declaration.declarations?.length !== 1
    ? undefined
    : declaration.declarations[0];
}

/**
 * Collect narrow local compound bridges used for public aliases or generic call signatures.
 * @param statements Program body statements.
 * @param importedBindings Runtime imports available to compound assembly.
 * @returns Supported local compound bridge pairs.
 */
function getCompoundBridges(
  statements: readonly ProgramStatement[],
  importedBindings: ReadonlySet<string>,
): CompoundBridge[] {
  const localAssemblies = new Set<string>();

  for (const statement of statements) {
    if (
      statement.type !== "VariableDeclaration" ||
      statement.kind !== "const" ||
      statement.declarations?.length !== 1
    ) {
      continue;
    }

    const [declarator] = statement.declarations;

    if (
      declarator?.id?.type === "Identifier" &&
      declarator.id.name?.endsWith("Compound") === true &&
      isCompoundAssembly(declarator.init, importedBindings)
    ) {
      localAssemblies.add(declarator.id.name);
    }
  }

  const bridges: CompoundBridge[] = [];

  for (const statement of statements) {
    if (
      statement.type === "ExportNamedDeclaration" &&
      (statement.declaration === undefined || statement.declaration === null) &&
      (statement.source === undefined || statement.source === null) &&
      statement.exportKind !== "type"
    ) {
      const specifiers = statement.specifiers as ModuleSpecifierLike[];

      for (const specifier of specifiers) {
        const exportName = specifier.exported?.name;
        const localName = specifier.local?.name;

        if (
          exportName !== undefined &&
          localName !== undefined &&
          specifier.type === "ExportSpecifier" &&
          specifier.exportKind !== "type" &&
          PASCAL_CASE.test(exportName) &&
          localName === `${exportName}Compound` &&
          localAssemblies.has(localName)
        ) {
          bridges.push({exportName, localName});
        }
      }

      continue;
    }

    const declarator = getExportedConstDeclarator(statement);
    const exportName = declarator?.id?.name;
    const initializer = declarator?.init;

    if (
      exportName === undefined ||
      declarator?.id?.type !== "Identifier" ||
      initializer?.type !== "TSAsExpression" ||
      initializer.expression?.type !== "Identifier"
    ) {
      continue;
    }

    const bridgeName = initializer.expression.name;

    if (
      bridgeName === undefined ||
      bridgeName !== `${exportName}Compound` ||
      !localAssemblies.has(bridgeName)
    ) {
      continue;
    }

    bridges.push({
      exportName,
      localName: bridgeName,
    });
  }

  return bridges;
}

/**
 * Check whether a named export contains only type declarations, re-exports, or supported API assembly.
 * @param node Export statement to inspect.
 * @param importedBindings Runtime imports available to compound assembly.
 * @param bridges Supported typed compound bridge pairs.
 * @returns Whether the named export is valid for an index barrel.
 */
function isAllowedNamedExport(
  node: ProgramStatement,
  importedBindings: ReadonlySet<string>,
  bridges: readonly CompoundBridge[],
): boolean {
  if (
    node.declaration === undefined ||
    node.declaration === null ||
    node.declaration.type === "TSInterfaceDeclaration" ||
    node.declaration.type === "TSTypeAliasDeclaration"
  ) {
    return true;
  }

  const declarator = getExportedConstDeclarator(node);

  if (declarator === undefined) {
    return false;
  }

  const exportName = declarator.id?.name;

  if (
    exportName !== undefined &&
    declarator.id?.type === "Identifier" &&
    PASCAL_CASE.test(exportName) &&
    (isImportedIdentifier(declarator.init ?? undefined, importedBindings) ||
      isStaticImportedObject(declarator.init, importedBindings) ||
      isCompoundAssembly(declarator.init, importedBindings))
  ) {
    return true;
  }

  const initializer = declarator.init;

  return (
    declarator.id?.type === "Identifier" &&
    exportName !== undefined &&
    initializer?.type === "TSAsExpression" &&
    initializer.expression?.type === "Identifier" &&
    initializer.expression.name !== undefined &&
    bridges.some(
      bridge =>
        bridge.exportName === exportName && bridge.localName === initializer.expression?.name,
    )
  );
}

/**
 * Check whether a local declaration is a supported typed compound bridge assembly.
 * @param node Top-level statement to inspect.
 * @param bridges Supported typed compound bridge pairs.
 * @returns Whether this declaration is owned by a supported bridge.
 */
function isAllowedCompoundBridgeDeclaration(
  node: ProgramStatement,
  bridges: readonly CompoundBridge[],
): boolean {
  if (
    node.type !== "VariableDeclaration" ||
    node.kind !== "const" ||
    node.declarations?.length !== 1
  ) {
    return false;
  }

  const [declarator] = node.declarations;

  return (
    declarator?.id?.type === "Identifier" &&
    declarator.id.name !== undefined &&
    bridges.some(bridge => bridge.localName === declarator.id?.name)
  );
}

/**
 * Check whether a top-level statement is valid in an index barrel.
 * @param node Top-level statement to inspect.
 * @param importedBindings Runtime imports available to compound assembly.
 * @param bridges Supported typed compound bridge pairs.
 * @returns Whether the statement belongs in an index barrel.
 */
function isAllowedStatement(
  node: ProgramStatement,
  importedBindings: ReadonlySet<string>,
  bridges: readonly CompoundBridge[],
): boolean {
  switch (node.type) {
    case "ExportAllDeclaration": {
      return true;
    }

    case "ExportDefaultDeclaration": {
      return node.declaration?.type === "Identifier";
    }

    case "ExportNamedDeclaration": {
      return isAllowedNamedExport(node, importedBindings, bridges);
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

    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration": {
      return true;
    }

    case "VariableDeclaration": {
      return isAllowedCompoundBridgeDeclaration(node, bridges);
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
      const importedBindings = getImportedRuntimeBindings(program.body);
      const bridges = getCompoundBridges(program.body, importedBindings);

      for (const statement of program.body) {
        if (!isAllowedStatement(statement, importedBindings, bridges)) {
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
        "require index files to contain only public-surface syntax and narrowly scoped compound component API assembly",
      url: getRuleDocumentationUrl("index-export-only"),
    },
    messages: {
      [MESSAGE_ID]:
        "Index files may contain only public-surface syntax and supported compound component API assembly. Move unrelated runtime implementation to a dedicated module.",
    },
    schema: [],
  },
};
