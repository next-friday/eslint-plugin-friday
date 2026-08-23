import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../core/create-rule.js";

type DeclarationInfo = {
  name: string;
  position: number;
};

const getTypeDeclarationName = (
  node: TSESTree.Node,
): DeclarationInfo | undefined => {
  if (
    (node.type === AST_NODE_TYPES.TSInterfaceDeclaration ||
      node.type === AST_NODE_TYPES.TSTypeAliasDeclaration) &&
    node.id.type === AST_NODE_TYPES.Identifier
  ) {
    return { name: node.id.name, position: node.range[0] };
  }

  return undefined;
};

const hasTypeParameterDeclaration = (
  node: TSESTree.Node,
  name: string,
): boolean => {
  if (
    !("typeParameters" in node) ||
    node.typeParameters?.type !== AST_NODE_TYPES.TSTypeParameterDeclaration
  ) {
    return false;
  }

  return node.typeParameters.params.some(
    (parameter) => parameter.name.name === name,
  );
};

const isTypeParameterReference = (
  node: TSESTree.Node,
  name: string,
): boolean => {
  let current: TSESTree.Node | undefined = node.parent;

  while (current) {
    if (hasTypeParameterDeclaration(current, name)) {
      return true;
    }

    current = current.parent;
  }

  return false;
};

export default createRule({
  name: "type-declaration-order",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce that referenced types and interfaces are declared after the type that uses them",
    },
    messages: {
      dependencyBeforeConsumer:
        "'{{dependency}}' should be declared after '{{consumer}}' which references it",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const typeDeclarations = new Map<string, number>();
    const reported = new Set<string>();

    const register = (
      node: TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration,
    ): void => {
      const info = getTypeDeclarationName(node)!;

      typeDeclarations.set(info.name, info.position);
    };

    return {
      TSInterfaceDeclaration: register,
      TSTypeAliasDeclaration: register,
      "TSPropertySignature TSTypeReference": (
        node: TSESTree.TSTypeReference,
      ): void => {
        if (node.typeName.type !== AST_NODE_TYPES.Identifier) {
          return;
        }

        const referencedName = node.typeName.name;
        const referencedPosition = typeDeclarations.get(referencedName);

        if (referencedPosition === undefined) {
          return;
        }

        if (isTypeParameterReference(node, referencedName)) {
          return;
        }

        let current: TSESTree.Node | undefined = node.parent;

        while (current) {
          const consumer = getTypeDeclarationName(current);

          if (consumer) {
            if (referencedPosition < consumer.position) {
              const reportKey = `${referencedName}-${consumer.name}`;

              if (!reported.has(reportKey)) {
                reported.add(reportKey);
                context.report({
                  node: node.typeName,
                  messageId: "dependencyBeforeConsumer",
                  data: { dependency: referencedName, consumer: consumer.name },
                });
              }
            }

            break;
          }

          current = current.parent;
        }
      },
    };
  },
});
