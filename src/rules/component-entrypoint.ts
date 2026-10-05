import path from "node:path";
import type {Rule} from "eslint";

import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const ASSEMBLY_MESSAGE_ID = "componentAssembly";

type IdentifierLike = {
  name?: string;
  type?: string;
};

type PropertyLike = {
  computed?: boolean;
  key?: IdentifierLike & {value?: unknown};
  kind?: string;
  method?: boolean;
  type: string;
  value?: ExpressionLike;
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

type ProgramStatement = {
  declaration?: VariableDeclarationLike | null;
  declarations?: VariableDeclaratorLike[];
  kind?: string;
  type: string;
};

type ProgramNode = Rule.Node & {
  body: ProgramStatement[];
};

type CompoundAssembly = {
  baseName: string;
  members: ReadonlyMap<string, string>;
  node: Rule.Node;
};

type ComponentCandidate = {
  exportName: string;
  assembly?: CompoundAssembly;
  node: Rule.Node;
};

const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/u;

/**
 * Get a static property key name.
 * @param property Object literal property.
 * @returns Static key name when supported.
 */
function getPropertyName(property: PropertyLike): string | undefined {
  if (property.computed === true) {
    return undefined;
  }

  if (property.key?.type === "Identifier") {
    return property.key.name;
  }

  return property.key?.type === "Literal" && typeof property.key.value === "string"
    ? property.key.value
    : undefined;
}

/**
 * Parse a static Object.assign component assembly.
 * @param expression Candidate initializer.
 * @returns Compound assembly details when the initializer is structurally supported.
 */
function getCompoundAssembly(
  expression: ExpressionLike | null | undefined,
): CompoundAssembly | undefined {
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
    return undefined;
  }

  const [base, staticMembers] = expression.arguments;

  if (
    base?.type !== "Identifier" ||
    base.name === undefined ||
    staticMembers?.type !== "ObjectExpression" ||
    staticMembers.properties === undefined
  ) {
    return undefined;
  }

  const members = new Map<string, string>();

  for (const property of staticMembers.properties) {
    const propertyName = getPropertyName(property);

    if (
      propertyName === undefined ||
      property.type !== "Property" ||
      property.kind !== "init" ||
      property.method === true ||
      property.value?.type !== "Identifier" ||
      property.value.name === undefined
    ) {
      return undefined;
    }

    members.set(propertyName, property.value.name);
  }

  return {
    baseName: base.name,
    members,
    node: expression as unknown as Rule.Node,
  };
}

/**
 * Get the single const declarator from a variable declaration.
 * @param declaration Variable declaration.
 * @returns The declarator when the declaration is a single const binding.
 */
function getSingleConstDeclarator(
  declaration: VariableDeclarationLike,
): VariableDeclaratorLike | undefined {
  return declaration.kind === "const" && declaration.declarations?.length === 1
    ? declaration.declarations[0]
    : undefined;
}

/**
 * Collect local typed compound assemblies such as CalendarCompound.
 * @param statements Program body statements.
 * @returns Local compound assemblies by binding name.
 */
function getLocalCompoundAssemblies(
  statements: readonly ProgramStatement[],
): ReadonlyMap<string, CompoundAssembly> {
  const assemblies = new Map<string, CompoundAssembly>();

  for (const statement of statements) {
    if (statement.type !== "VariableDeclaration") {
      continue;
    }

    const declarator = getSingleConstDeclarator(statement as VariableDeclarationLike);
    const localName = declarator?.id?.name;
    const assembly = getCompoundAssembly(declarator?.init);

    if (
      assembly !== undefined &&
      localName !== undefined &&
      declarator?.id?.type === "Identifier" &&
      localName.endsWith("Compound")
    ) {
      assemblies.set(localName, assembly);
    }
  }

  return assemblies;
}

/**
 * Resolve an exported component entrypoint candidate.
 * @param statement Top-level export statement.
 * @param localAssemblies Local typed compound assemblies.
 * @returns Component candidate when the export looks like a Friday component public alias.
 */
function getComponentCandidate(
  statement: ProgramStatement,
  localAssemblies: ReadonlyMap<string, CompoundAssembly>,
): ComponentCandidate | undefined {
  if (
    statement.type !== "ExportNamedDeclaration" ||
    statement.declaration?.type !== "VariableDeclaration"
  ) {
    return undefined;
  }

  const declarator = getSingleConstDeclarator(statement.declaration as VariableDeclarationLike);
  const exportName = declarator?.id?.name;
  const initializer = declarator?.init;

  if (exportName === undefined || initializer === undefined || initializer === null) {
    return undefined;
  }

  if (declarator?.id?.type !== "Identifier" || !PASCAL_CASE.test(exportName)) {
    return undefined;
  }

  const directAssembly = getCompoundAssembly(initializer);

  if (directAssembly !== undefined) {
    return {
      assembly: directAssembly,
      exportName,
      node: initializer as unknown as Rule.Node,
    };
  }

  if (initializer.type === "Identifier" && initializer.name?.endsWith("Root") === true) {
    return {
      exportName,
      node: initializer as unknown as Rule.Node,
    };
  }

  if (
    initializer.type === "TSAsExpression" &&
    initializer.expression?.type === "Identifier" &&
    initializer.expression.name === `${exportName}Compound`
  ) {
    return {
      assembly: localAssemblies.get(initializer.expression.name),
      exportName,
      node: initializer as unknown as Rule.Node,
    };
  }

  return undefined;
}

/**
 * Check whether a filename belongs to a component index entrypoint.
 * @param filename Filename reported by ESLint.
 * @returns Whether the final basename is exactly index.
 */
function isIndexFile(filename: string): boolean {
  return path.parse(filename).name === "index";
}

export const componentEntrypoint: Rule.RuleModule = {
  create(context) {
    if (!isIndexFile(context.filename)) {
      return {};
    }

    const checkProgram = (node: unknown): void => {
      const program = node as ProgramNode;
      const localAssemblies = getLocalCompoundAssemblies(program.body);

      for (const statement of program.body) {
        const candidate = getComponentCandidate(statement, localAssemblies);

        if (candidate === undefined) {
          continue;
        }

        const {assembly, exportName} = candidate;

        if (
          assembly === undefined ||
          assembly.baseName !== `${exportName}Root` ||
          assembly.members.get("Root") !== assembly.baseName
        ) {
          context.report({
            data: {name: exportName},
            messageId: ASSEMBLY_MESSAGE_ID,
            node: candidate.node,
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
      description: "require Friday component index entrypoints to expose a canonical compound API",
      url: getRuleDocumentationUrl("component-entrypoint"),
    },
    defaultOptions: [{ignoreMembers: []}],
    messages: {
      [ASSEMBLY_MESSAGE_ID]:
        "Assemble component '{{name}}' with Object.assign({{name}}Root, {...}) and expose Root: {{name}}Root.",
    },
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          ignoreMembers: {
            description:
              "Compatibility option retained for existing configurations; it has no effect because this rule no longer validates ComponentProps aliases.",
            type: "array",
            uniqueItems: true,
            items: {type: "string"},
          },
        },
      },
    ],
  },
};
