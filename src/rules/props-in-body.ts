import type {FunctionComponentSemanticNode} from "@eslint-react/core";
import type {Rule} from "eslint";

import {createFunctionComponentVisitor} from "../utils/function-component-visitor";
import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const DESTRUCTURE_MESSAGE_ID = "propertiesInBody";
const PARAMETER_NAME_MESSAGE_ID = "parameterName";
const REST_NAME_MESSAGE_ID = "restName";
const FUNCTION_NODE_TYPES = new Set([
  "ArrowFunctionExpression",
  "FunctionDeclaration",
  "FunctionExpression",
]);

type ComponentParameter = FunctionComponentSemanticNode["node"]["params"][number];

type IdentifierLike = Rule.Node & {
  name?: string;
  type: string;
};

type PatternLike = Rule.Node & {
  argument?: IdentifierLike;
  declarations?: PatternLike[];
  id?: PatternLike;
  init?: IdentifierLike | null;
  left?: PatternLike;
  name?: string;
  properties?: PatternLike[];
  type: string;
};

type FunctionLike = {
  body?: PatternLike;
};

type RuleOptions = {
  parameterName?: string;
  restName?: string;
};

function getParameterIdentifier(
  parameter: ComponentParameter | undefined,
): IdentifierLike | undefined {
  if (parameter === undefined) {
    return undefined;
  }

  const pattern = parameter as unknown as PatternLike;

  if (pattern.type === "Identifier") {
    return pattern;
  }

  return pattern.type === "AssignmentPattern" && pattern.left?.type === "Identifier"
    ? pattern.left
    : undefined;
}

function hasReportedDestructuredParameter(
  context: Rule.RuleContext,
  parameter: ComponentParameter | undefined,
): boolean {
  if (parameter === undefined) {
    return false;
  }

  const pattern = parameter as unknown as PatternLike;
  const target = pattern.type === "AssignmentPattern" ? pattern.left : pattern;

  if (target?.type === "ObjectPattern") {
    context.report({
      messageId: DESTRUCTURE_MESSAGE_ID,
      node: target,
    });

    return true;
  }

  return false;
}

function reportInvalidRestName(
  context: Rule.RuleContext,
  component: FunctionLike,
  parameterName: string,
  restName: string,
): void {
  const body = component.body;

  if (body?.type !== "BlockStatement") {
    return;
  }

  const visit = (node: Rule.Node, isRoot = false): void => {
    if (!isRoot && FUNCTION_NODE_TYPES.has(node.type)) {
      return;
    }

    if (node.type === "VariableDeclaration") {
      const declarations = (node as PatternLike).declarations ?? [];

      for (const declaration of declarations) {
        const id = declaration.id;

        if (
          declaration.type !== "VariableDeclarator" ||
          declaration.init?.type !== "Identifier" ||
          declaration.init.name !== parameterName ||
          id?.type !== "ObjectPattern"
        ) {
          continue;
        }

        const properties = id.properties ?? [];

        for (const property of properties) {
          if (
            property.type === "RestElement" &&
            property.argument?.type === "Identifier" &&
            property.argument.name !== restName
          ) {
            context.report({
              messageId: REST_NAME_MESSAGE_ID,
              data: {name: restName},
              node: property.argument,
            });
          }
        }
      }
    }

    const record = node as unknown as Record<string, unknown>;

    const visitorKeys = context.sourceCode.visitorKeys[node.type] ?? [];

    for (const key of visitorKeys) {
      const child = record[key];

      if (Array.isArray(child)) {
        for (const entry of child) {
          if (
            typeof entry === "object" &&
            entry !== null &&
            "type" in entry &&
            typeof entry.type === "string"
          ) {
            visit(entry as Rule.Node);
          }
        }

        continue;
      }

      if (
        typeof child === "object" &&
        child !== null &&
        "type" in child &&
        typeof child.type === "string"
      ) {
        visit(child as Rule.Node);
      }
    }
  };

  visit(body, true);
}

export const propsInBody: Rule.RuleModule = {
  create(context) {
    const [options] = context.options as [RuleOptions?];

    return createFunctionComponentVisitor(context, (_node, components) => {
      for (const component of components) {
        const [parameter] = component.node.params;

        if (hasReportedDestructuredParameter(context, parameter)) {
          continue;
        }

        const identifier = getParameterIdentifier(parameter);

        if (
          identifier !== undefined &&
          options?.parameterName !== undefined &&
          identifier.name !== options.parameterName
        ) {
          context.report({
            messageId: PARAMETER_NAME_MESSAGE_ID,
            data: {name: options.parameterName},
            node: identifier,
          });

          continue;
        }

        if (
          identifier?.name !== undefined &&
          options?.restName !== undefined &&
          (options.parameterName === undefined || identifier.name === options.parameterName)
        ) {
          reportInvalidRestName(
            context,
            component.node as FunctionLike,
            identifier.name,
            options.restName,
          );
        }
      }
    });
  },
  meta: {
    languages: ["js/js"],
    type: "suggestion",
    docs: {
      description:
        "require React function components to accept props through a named parameter and destructure them inside the body",
      url: getRuleDocumentationUrl("props-in-body"),
    },
    defaultOptions: [{}],
    messages: {
      [DESTRUCTURE_MESSAGE_ID]:
        "Accept props as a named parameter and destructure them inside the React function component body.",
      [PARAMETER_NAME_MESSAGE_ID]: "Name the React component props parameter '{{name}}'.",
      [REST_NAME_MESSAGE_ID]: "Name the React component props rest binding '{{name}}'.",
    },
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          parameterName: {
            description: "Required name for the React component props parameter.",
            type: "string",
            minLength: 1,
          },
          restName: {
            description: "Required name for the rest binding when destructuring component props.",
            type: "string",
            minLength: 1,
          },
        },
      },
    ],
  },
};
