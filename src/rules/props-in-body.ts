import type {FunctionComponentSemanticNode} from "@eslint-react/core";
import type {Rule} from "eslint";

import {createFunctionComponentVisitor} from "../utils/function-component-visitor";
import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const MESSAGE_ID = "propertiesInBody";

type ComponentParameter = FunctionComponentSemanticNode["node"]["params"][number];

/**
 * Report React component parameters that destructure object props in the signature.
 * @param context ESLint rule context.
 * @param parameter First component parameter, when present.
 */
function reportDestructuredParameter(
  context: Rule.RuleContext,
  parameter: ComponentParameter | undefined,
): void {
  if (parameter === undefined) {
    return;
  }

  if ("properties" in parameter) {
    context.report({
      messageId: MESSAGE_ID,
      node: parameter,
    });

    return;
  }

  if ("left" in parameter && "properties" in parameter.left) {
    context.report({
      messageId: MESSAGE_ID,
      node: parameter.left,
    });
  }
}

export const propsInBody: Rule.RuleModule = {
  create(context) {
    return createFunctionComponentVisitor(context, (_node, components) => {
      let index = 0;

      while (index < components.length) {
        const component = components[index] as (typeof components)[number];

        index += 1;

        const [parameter] = component.node.params;

        reportDestructuredParameter(context, parameter);
      }
    });
  },
  meta: {
    languages: ["js/js"],
    type: "suggestion",
    docs: {
      description:
        "disallow object destructuring in the first parameter of React function components",
      url: getRuleDocumentationUrl("props-in-body"),
    },
    messages: {
      [MESSAGE_ID]:
        "Accept props as a named parameter and destructure them inside the React function component body.",
    },
    schema: [],
  },
};
