import type {FunctionComponentSemanticNode} from "@eslint-react/core";
import type {Rule} from "eslint";

import {createFunctionComponentVisitor} from "../utils/function-component-visitor";
import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const MESSAGE_ID = "functionDeclaration";

type IdentifierLike = Rule.Node & {
  name?: string;
  type: string;
};

function getComponentName(component: FunctionComponentSemanticNode): IdentifierLike | undefined {
  const node = component.node as FunctionComponentSemanticNode["node"] & {
    id?: IdentifierLike | null;
  };

  if (node.type === "FunctionDeclaration") {
    return node.id ?? undefined;
  }

  const initPath = component.initPath;

  if (initPath !== null && initPath.length > 1) {
    const declarator = initPath[1] as {id?: IdentifierLike};

    return declarator.id?.type === "Identifier" ? declarator.id : undefined;
  }

  return undefined;
}

export const componentDefinitionStyle: Rule.RuleModule = {
  create(context) {
    return createFunctionComponentVisitor(context, (_node, components) => {
      for (const component of components) {
        const name = getComponentName(component);

        if (name === undefined || component.node.type === "FunctionDeclaration") {
          continue;
        }

        context.report({
          messageId: MESSAGE_ID,
          data: {name: name.name ?? "Component"},
          node: name,
        });
      }
    });
  },
  meta: {
    languages: ["js/js"],
    type: "suggestion",
    docs: {
      description: "require named React function components to use function declarations",
      url: getRuleDocumentationUrl("component-definition-style"),
    },
    messages: {
      [MESSAGE_ID]: "Define React component '{{name}}' with a function declaration.",
    },
    schema: [],
  },
};
