import type {FunctionComponentSemanticNode} from "@eslint-react/core";
import type {Rule} from "eslint";

import {createFunctionComponentVisitor} from "../utils/function-component-visitor";
import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const MESSAGE_ID = "namedProperties";

type ComponentParameter = FunctionComponentSemanticNode["node"]["params"][number];

type TypedParameter = {
  typeAnnotation?: {
    typeAnnotation?: {
      type?: string;
    };
  };
};

/**
 * Get the typed identifier behind a component parameter.
 * @param parameter Component parameter to inspect.
 * @returns Typed identifier parameter, including one wrapped by a default assignment.
 */
function getTypedParameter(parameter: ComponentParameter | undefined): TypedParameter | undefined {
  if (parameter === undefined) {
    return undefined;
  }

  const typedParameter = parameter as TypedParameter & {left?: TypedParameter};

  if (typedParameter.typeAnnotation !== undefined) {
    return typedParameter;
  }

  return typedParameter.left?.typeAnnotation === undefined ? undefined : typedParameter.left;
}

export const namedProps: Rule.RuleModule = {
  create(context) {
    return createFunctionComponentVisitor(context, (_node, components) => {
      let index = 0;

      while (index < components.length) {
        const component = components[index] as (typeof components)[number];

        index += 1;

        const [parameter] = component.node.params;
        const typedParameter = getTypedParameter(parameter);
        const typeAnnotation = typedParameter?.typeAnnotation?.typeAnnotation;

        if (typeAnnotation?.type === "TSIntersectionType") {
          context.report({
            messageId: MESSAGE_ID,
            node: parameter as Rule.Node,
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
        "disallow inline intersections in the first parameter of React function components",
      url: getRuleDocumentationUrl("named-props"),
    },
    messages: {
      [MESSAGE_ID]:
        "Move the inline intersection props type into a named props type and use that type as the component parameter type.",
    },
    schema: [],
  },
};
