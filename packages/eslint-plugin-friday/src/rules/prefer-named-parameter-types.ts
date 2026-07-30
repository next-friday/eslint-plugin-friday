import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import {
  getParameterTypeAnnotation,
  isFunctionNode,
  type FunctionNode,
} from "../ast/nodes.js";
import { isReactComponentFunction } from "../ast/jsx.js";
import { createRule } from "../core/create-rule.js";

type CheckedNode =
  FunctionNode | TSESTree.TSMethodSignature | TSESTree.MethodDefinition;

const hasInlineObjectType = (parameter: TSESTree.Parameter): boolean =>
  getParameterTypeAnnotation(parameter)?.type === AST_NODE_TYPES.TSTypeLiteral;

const getParameters = (node: CheckedNode): TSESTree.Parameter[] => {
  if ("params" in node) {
    return node.params;
  }
  return node.value.params;
};

const isComponentWithSingleIdentifierParameter = (
  node: CheckedNode,
  parameters: TSESTree.Parameter[],
): boolean =>
  isFunctionNode(node) &&
  parameters.length === 1 &&
  parameters[0].type === AST_NODE_TYPES.Identifier &&
  isReactComponentFunction(node);

export default createRule({
  name: "prefer-named-parameter-types",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce named interfaces/types instead of inline object types for function parameters",
    },
    messages: {
      preferNamedParamTypes:
        "Use a named interface or type for object parameter types instead of inline type annotations",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const checkFunction = (node: CheckedNode): void => {
      const parameters = getParameters(node);

      if (isComponentWithSingleIdentifierParameter(node, parameters)) {
        return;
      }

      for (const parameter of parameters) {
        if (hasInlineObjectType(parameter)) {
          context.report({
            node: parameter,
            messageId: "preferNamedParamTypes",
          });
        }
      }
    };

    return {
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
      TSMethodSignature: checkFunction,
      MethodDefinition: checkFunction,
    };
  },
});
