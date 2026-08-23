import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { describe, expect, it } from "vitest";

import {
  forEachFunctionParameter,
  type FunctionNode,
  getParameterTypeAnnotation,
  hasBooleanTypeAnnotation,
  isBooleanLiteral,
  isFunctionInitializer,
  isFunctionNode,
  isGlobalScope,
  isJsxProducingExpression,
  isEnvironmentAccess,
  isProgramLevelNode,
  hasInlineObjectLiteralTypeNode,
  unwrapTSAsExpression,
} from "../../src/ast/nodes.js";

const node = <NodeType>(
  type: AST_NODE_TYPES,
  properties: object = {},
): NodeType => ({ type, ...properties }) as unknown as NodeType;

const NULL = JSON.parse("null") as null;

const UNDEFINED = ([] as undefined[]).at(0);

const booleanKeyword = node<TSESTree.TSBooleanKeyword>(
  AST_NODE_TYPES.TSBooleanKeyword,
);

const stringKeyword = node<TSESTree.TSStringKeyword>(
  AST_NODE_TYPES.TSStringKeyword,
);

const typeAnnotation = (inner: TSESTree.TypeNode): TSESTree.TSTypeAnnotation =>
  node<TSESTree.TSTypeAnnotation>(AST_NODE_TYPES.TSTypeAnnotation, {
    typeAnnotation: inner,
  });

const program = node<TSESTree.Program>(AST_NODE_TYPES.Program);

const jsxElement = node<TSESTree.JSXElement>(AST_NODE_TYPES.JSXElement);

const jsxFragment = node<TSESTree.JSXFragment>(AST_NODE_TYPES.JSXFragment);

const numberLiteral = node<TSESTree.Literal>(AST_NODE_TYPES.Literal, {
  value: 1,
});

const returnStatement = (
  argument: TSESTree.Expression | null,
): TSESTree.ReturnStatement =>
  node<TSESTree.ReturnStatement>(AST_NODE_TYPES.ReturnStatement, { argument });

const blockStatement = (body: TSESTree.Statement[]): TSESTree.BlockStatement =>
  node<TSESTree.BlockStatement>(AST_NODE_TYPES.BlockStatement, { body });

const callExpression = (
  callee: object,
  arguments_: object[],
): TSESTree.CallExpression =>
  node<TSESTree.CallExpression>(AST_NODE_TYPES.CallExpression, {
    callee,
    arguments: arguments_,
  });

const memberCallee = (propertyName: string): TSESTree.MemberExpression =>
  node<TSESTree.MemberExpression>(AST_NODE_TYPES.MemberExpression, {
    property: node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
      name: propertyName,
    }),
  });

describe("isFunctionNode", () => {
  it("accepts the three function node types", () => {
    expect(
      isFunctionNode(node<TSESTree.Node>(AST_NODE_TYPES.FunctionDeclaration)),
    ).toBe(true);
    expect(
      isFunctionNode(node<TSESTree.Node>(AST_NODE_TYPES.FunctionExpression)),
    ).toBe(true);
    expect(
      isFunctionNode(
        node<TSESTree.Node>(AST_NODE_TYPES.ArrowFunctionExpression),
      ),
    ).toBe(true);
  });

  it("rejects a non-function node", () => {
    expect(isFunctionNode(node<TSESTree.Node>(AST_NODE_TYPES.Identifier))).toBe(
      false,
    );
  });
});

describe("forEachFunctionParameter", () => {
  it("visits every parameter in order", () => {
    const first = node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
      name: "a",
    });
    const second = node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
      name: "b",
    });
    const function_ = node<FunctionNode>(AST_NODE_TYPES.FunctionDeclaration, {
      params: [first, second],
    });
    const visited: string[] = [];
    forEachFunctionParameter(function_, (parameter) => {
      visited.push((parameter as TSESTree.Identifier).name);
    });
    expect(visited).toEqual(["a", "b"]);
  });

  it("visits nothing when there are no parameters", () => {
    const function_ = node<FunctionNode>(
      AST_NODE_TYPES.ArrowFunctionExpression,
      {
        params: [],
      },
    );
    const visited: TSESTree.Parameter[] = [];
    forEachFunctionParameter(function_, (parameter) => {
      visited.push(parameter);
    });
    expect(visited).toEqual([]);
  });
});

describe("hasInlineObjectLiteralTypeNode", () => {
  it("returns true for a type literal", () => {
    expect(
      hasInlineObjectLiteralTypeNode(
        node<TSESTree.TypeNode>(AST_NODE_TYPES.TSTypeLiteral),
      ),
    ).toBe(true);
  });

  it("recurses into type reference type arguments", () => {
    const withLiteral = node<TSESTree.TypeNode>(
      AST_NODE_TYPES.TSTypeReference,
      {
        typeArguments: {
          params: [node<TSESTree.TypeNode>(AST_NODE_TYPES.TSTypeLiteral)],
        },
      },
    );
    const withoutLiteral = node<TSESTree.TypeNode>(
      AST_NODE_TYPES.TSTypeReference,
      {
        typeArguments: {
          params: [stringKeyword],
        },
      },
    );
    expect(hasInlineObjectLiteralTypeNode(withLiteral)).toBe(true);
    expect(hasInlineObjectLiteralTypeNode(withoutLiteral)).toBe(false);
  });

  it("returns false for a type reference without type arguments", () => {
    expect(
      hasInlineObjectLiteralTypeNode(
        node<TSESTree.TypeNode>(AST_NODE_TYPES.TSTypeReference),
      ),
    ).toBe(false);
  });

  it("recurses into union members", () => {
    const unionWithLiteral = node<TSESTree.TypeNode>(
      AST_NODE_TYPES.TSUnionType,
      {
        types: [
          stringKeyword,
          node<TSESTree.TypeNode>(AST_NODE_TYPES.TSTypeLiteral),
        ],
      },
    );
    const unionWithoutLiteral = node<TSESTree.TypeNode>(
      AST_NODE_TYPES.TSUnionType,
      {
        types: [stringKeyword, booleanKeyword],
      },
    );
    expect(hasInlineObjectLiteralTypeNode(unionWithLiteral)).toBe(true);
    expect(hasInlineObjectLiteralTypeNode(unionWithoutLiteral)).toBe(false);
  });

  it("returns false for an unrelated type node", () => {
    expect(hasInlineObjectLiteralTypeNode(stringKeyword)).toBe(false);
  });
});

describe("getParameterTypeAnnotation", () => {
  it("unwraps an assignment pattern to its left binding", () => {
    const assignment = node<TSESTree.Parameter>(
      AST_NODE_TYPES.AssignmentPattern,
      {
        left: node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
          typeAnnotation: typeAnnotation(booleanKeyword),
        }),
      },
    );
    expect(getParameterTypeAnnotation(assignment)).toBe(booleanKeyword);
  });

  it("returns the annotation of a type-annotated parameter", () => {
    const identifier = node<TSESTree.Parameter>(AST_NODE_TYPES.Identifier, {
      typeAnnotation: typeAnnotation(stringKeyword),
    });
    expect(getParameterTypeAnnotation(identifier)).toBe(stringKeyword);
  });

  it("returns undefined when a type-annotated parameter has no annotation", () => {
    const identifier = node<TSESTree.Parameter>(AST_NODE_TYPES.Identifier);
    expect(getParameterTypeAnnotation(identifier)).toBeUndefined();
  });

  it("returns undefined for a parameter type that carries no annotation", () => {
    const parameterProperty = node<TSESTree.Parameter>(
      AST_NODE_TYPES.TSParameterProperty,
    );
    expect(getParameterTypeAnnotation(parameterProperty)).toBeUndefined();
  });
});

describe("isProgramLevelNode", () => {
  it("returns false when the node has no parent", () => {
    expect(
      isProgramLevelNode(node<TSESTree.Node>(AST_NODE_TYPES.Identifier)),
    ).toBe(false);
  });

  it("returns true when the parent is the program", () => {
    expect(
      isProgramLevelNode(
        node<TSESTree.Node>(AST_NODE_TYPES.VariableDeclaration, {
          parent: program,
        }),
      ),
    ).toBe(true);
  });

  it("returns true for a named export at the program level", () => {
    const exportNode = node<TSESTree.ExportNamedDeclaration>(
      AST_NODE_TYPES.ExportNamedDeclaration,
      { parent: program },
    );
    expect(
      isProgramLevelNode(
        node<TSESTree.Node>(AST_NODE_TYPES.VariableDeclaration, {
          parent: exportNode,
        }),
      ),
    ).toBe(true);
  });

  it("returns false for a named export not at the program level", () => {
    const exportNode = node<TSESTree.ExportNamedDeclaration>(
      AST_NODE_TYPES.ExportNamedDeclaration,
      { parent: node<TSESTree.Node>(AST_NODE_TYPES.BlockStatement) },
    );
    expect(
      isProgramLevelNode(
        node<TSESTree.Node>(AST_NODE_TYPES.VariableDeclaration, {
          parent: exportNode,
        }),
      ),
    ).toBe(false);
  });

  it("returns false for any other parent", () => {
    const blockParent = node<TSESTree.Node>(AST_NODE_TYPES.BlockStatement);
    expect(
      isProgramLevelNode(
        node<TSESTree.Node>(AST_NODE_TYPES.VariableDeclaration, {
          parent: blockParent,
        }),
      ),
    ).toBe(false);
  });
});

describe("isFunctionInitializer", () => {
  it("accepts arrow and function expressions", () => {
    expect(
      isFunctionInitializer(
        node<TSESTree.Expression>(AST_NODE_TYPES.ArrowFunctionExpression),
      ),
    ).toBe(true);
    expect(
      isFunctionInitializer(
        node<TSESTree.Expression>(AST_NODE_TYPES.FunctionExpression),
      ),
    ).toBe(true);
  });

  it("rejects other expressions and nullish input", () => {
    expect(
      isFunctionInitializer(node<TSESTree.Expression>(AST_NODE_TYPES.Literal)),
    ).toBe(false);
    expect(isFunctionInitializer(NULL)).toBe(false);
    expect(isFunctionInitializer(UNDEFINED)).toBe(false);
  });
});

describe("isEnvironmentAccess", () => {
  it("returns false for a non-member expression", () => {
    expect(
      isEnvironmentAccess(node<TSESTree.Node>(AST_NODE_TYPES.Identifier)),
    ).toBe(false);
  });

  it("returns false when the object is not a member expression", () => {
    const identifierObject = node<TSESTree.Node>(AST_NODE_TYPES.Identifier);
    expect(
      isEnvironmentAccess(
        node<TSESTree.Node>(AST_NODE_TYPES.MemberExpression, {
          object: identifierObject,
        }),
      ),
    ).toBe(false);
  });

  it("returns true for process.env access", () => {
    const processEnvironmentObject = node<TSESTree.Node>(
      AST_NODE_TYPES.MemberExpression,
      {
        object: node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
          name: "process",
        }),
        property: node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
          name: "env",
        }),
      },
    );
    expect(
      isEnvironmentAccess(
        node<TSESTree.Node>(AST_NODE_TYPES.MemberExpression, {
          object: processEnvironmentObject,
        }),
      ),
    ).toBe(true);
  });

  it("returns true for import.meta.env access", () => {
    const importMetaEnvironmentObject = node<TSESTree.Node>(
      AST_NODE_TYPES.MemberExpression,
      {
        object: node<TSESTree.Node>(AST_NODE_TYPES.MetaProperty),
        property: node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
          name: "env",
        }),
      },
    );
    expect(
      isEnvironmentAccess(
        node<TSESTree.Node>(AST_NODE_TYPES.MemberExpression, {
          object: importMetaEnvironmentObject,
        }),
      ),
    ).toBe(true);
  });

  it("returns false when the inner object is not the process identifier", () => {
    const globalThisEnvironmentObject = node<TSESTree.Node>(
      AST_NODE_TYPES.MemberExpression,
      {
        object: node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
          name: "globalThis",
        }),
        property: node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
          name: "env",
        }),
      },
    );
    expect(
      isEnvironmentAccess(
        node<TSESTree.Node>(AST_NODE_TYPES.MemberExpression, {
          object: globalThisEnvironmentObject,
        }),
      ),
    ).toBe(false);
  });

  it("returns false when the inner property is not env", () => {
    const processArgvObject = node<TSESTree.Node>(
      AST_NODE_TYPES.MemberExpression,
      {
        object: node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
          name: "process",
        }),
        property: node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
          name: "argv",
        }),
      },
    );
    expect(
      isEnvironmentAccess(
        node<TSESTree.Node>(AST_NODE_TYPES.MemberExpression, {
          object: processArgvObject,
        }),
      ),
    ).toBe(false);
  });

  it("returns false when the inner object is not an identifier", () => {
    const nestedMemberEnvironmentObject = node<TSESTree.Node>(
      AST_NODE_TYPES.MemberExpression,
      {
        object: node<TSESTree.Node>(AST_NODE_TYPES.MemberExpression),
        property: node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
          name: "env",
        }),
      },
    );
    expect(
      isEnvironmentAccess(
        node<TSESTree.Node>(AST_NODE_TYPES.MemberExpression, {
          object: nestedMemberEnvironmentObject,
        }),
      ),
    ).toBe(false);
  });

  it("returns false when the inner property is not an identifier", () => {
    const literalEnvironmentPropertyObject = node<TSESTree.Node>(
      AST_NODE_TYPES.MemberExpression,
      {
        object: node<TSESTree.Identifier>(AST_NODE_TYPES.Identifier, {
          name: "process",
        }),
        property: node<TSESTree.Node>(AST_NODE_TYPES.Literal),
      },
    );
    expect(
      isEnvironmentAccess(
        node<TSESTree.Node>(AST_NODE_TYPES.MemberExpression, {
          object: literalEnvironmentPropertyObject,
        }),
      ),
    ).toBe(false);
  });
});

describe("unwrapTSAsExpression", () => {
  it("returns a non-as expression unchanged", () => {
    const identifier = node<TSESTree.Node>(AST_NODE_TYPES.Identifier);
    expect(unwrapTSAsExpression(identifier)).toBe(identifier);
  });

  it("unwraps nested as expressions to the innermost node", () => {
    const inner = node<TSESTree.Node>(AST_NODE_TYPES.Identifier);
    const outer = node<TSESTree.Node>(AST_NODE_TYPES.TSAsExpression, {
      expression: node<TSESTree.Node>(AST_NODE_TYPES.TSAsExpression, {
        expression: inner,
      }),
    });
    expect(unwrapTSAsExpression(outer)).toBe(inner);
  });
});

describe("isGlobalScope", () => {
  it("returns true when the parent is the program", () => {
    expect(
      isGlobalScope(
        node<TSESTree.VariableDeclaration>(AST_NODE_TYPES.VariableDeclaration, {
          parent: program,
        }),
      ),
    ).toBe(true);
  });

  it("returns true for a named export at the program level", () => {
    const exportNode = node<TSESTree.ExportNamedDeclaration>(
      AST_NODE_TYPES.ExportNamedDeclaration,
      { parent: program },
    );
    expect(
      isGlobalScope(
        node<TSESTree.VariableDeclaration>(AST_NODE_TYPES.VariableDeclaration, {
          parent: exportNode,
        }),
      ),
    ).toBe(true);
  });

  it("returns false for a named export not at the program level", () => {
    const exportNode = node<TSESTree.ExportNamedDeclaration>(
      AST_NODE_TYPES.ExportNamedDeclaration,
      { parent: node<TSESTree.Node>(AST_NODE_TYPES.BlockStatement) },
    );
    expect(
      isGlobalScope(
        node<TSESTree.VariableDeclaration>(AST_NODE_TYPES.VariableDeclaration, {
          parent: exportNode,
        }),
      ),
    ).toBe(false);
  });

  it("returns false for any other parent", () => {
    const blockScopeParent = node<TSESTree.Node>(AST_NODE_TYPES.BlockStatement);
    expect(
      isGlobalScope(
        node<TSESTree.VariableDeclaration>(AST_NODE_TYPES.VariableDeclaration, {
          parent: blockScopeParent,
        }),
      ),
    ).toBe(false);
  });
});

describe("isBooleanLiteral", () => {
  it("returns true for a boolean literal", () => {
    expect(
      isBooleanLiteral(
        node<TSESTree.Expression>(AST_NODE_TYPES.Literal, { value: true }),
      ),
    ).toBe(true);
  });

  it("returns false for a non-boolean literal", () => {
    expect(isBooleanLiteral(numberLiteral)).toBe(false);
  });

  it("returns false for a non-literal expression", () => {
    expect(
      isBooleanLiteral(node<TSESTree.Expression>(AST_NODE_TYPES.Identifier)),
    ).toBe(false);
  });
});

describe("hasBooleanTypeAnnotation", () => {
  it("returns true for an identifier annotated as boolean", () => {
    const booleanTypeAnnotation = typeAnnotation(booleanKeyword);
    expect(
      hasBooleanTypeAnnotation(
        node<TSESTree.Parameter>(AST_NODE_TYPES.Identifier, {
          typeAnnotation: booleanTypeAnnotation,
        }),
      ),
    ).toBe(true);
  });

  it("returns true for a declarator whose id is annotated as boolean", () => {
    const booleanAnnotatedIdentifier = node<TSESTree.Identifier>(
      AST_NODE_TYPES.Identifier,
      {
        typeAnnotation: typeAnnotation(booleanKeyword),
      },
    );
    expect(
      hasBooleanTypeAnnotation(
        node<TSESTree.VariableDeclarator>(AST_NODE_TYPES.VariableDeclarator, {
          id: booleanAnnotatedIdentifier,
        }),
      ),
    ).toBe(true);
  });

  it("returns false for an identifier annotated as a non-boolean", () => {
    const stringTypeAnnotation = typeAnnotation(stringKeyword);
    expect(
      hasBooleanTypeAnnotation(
        node<TSESTree.Parameter>(AST_NODE_TYPES.Identifier, {
          typeAnnotation: stringTypeAnnotation,
        }),
      ),
    ).toBe(false);
  });

  it("returns false for a declarator whose id is not an identifier", () => {
    const objectPatternId = node<TSESTree.Node>(AST_NODE_TYPES.ObjectPattern);
    expect(
      hasBooleanTypeAnnotation(
        node<TSESTree.VariableDeclarator>(AST_NODE_TYPES.VariableDeclarator, {
          id: objectPatternId,
        }),
      ),
    ).toBe(false);
  });

  it("returns false for a declarator whose id has a non-boolean annotation", () => {
    const stringAnnotatedIdentifier = node<TSESTree.Identifier>(
      AST_NODE_TYPES.Identifier,
      {
        typeAnnotation: typeAnnotation(stringKeyword),
      },
    );
    expect(
      hasBooleanTypeAnnotation(
        node<TSESTree.VariableDeclarator>(AST_NODE_TYPES.VariableDeclarator, {
          id: stringAnnotatedIdentifier,
        }),
      ),
    ).toBe(false);
  });
});

describe("isJsxProducingExpression", () => {
  it("returns true for a jsx element and a jsx fragment", () => {
    expect(isJsxProducingExpression(jsxElement)).toBe(true);
    expect(isJsxProducingExpression(jsxFragment)).toBe(true);
  });

  it("inspects both branches of a conditional expression", () => {
    expect(
      isJsxProducingExpression(
        node<TSESTree.Expression>(AST_NODE_TYPES.ConditionalExpression, {
          consequent: jsxElement,
          alternate: numberLiteral,
        }),
      ),
    ).toBe(true);
    expect(
      isJsxProducingExpression(
        node<TSESTree.Expression>(AST_NODE_TYPES.ConditionalExpression, {
          consequent: numberLiteral,
          alternate: jsxFragment,
        }),
      ),
    ).toBe(true);
    expect(
      isJsxProducingExpression(
        node<TSESTree.Expression>(AST_NODE_TYPES.ConditionalExpression, {
          consequent: numberLiteral,
          alternate: numberLiteral,
        }),
      ),
    ).toBe(false);
  });

  it("inspects the right side of a logical expression", () => {
    expect(
      isJsxProducingExpression(
        node<TSESTree.Expression>(AST_NODE_TYPES.LogicalExpression, {
          right: jsxElement,
        }),
      ),
    ).toBe(true);
  });

  it("inspects array elements and skips holes and spreads", () => {
    expect(
      isJsxProducingExpression(
        node<TSESTree.Expression>(AST_NODE_TYPES.ArrayExpression, {
          elements: [jsxElement],
        }),
      ),
    ).toBe(true);
    const spreadElement = node<TSESTree.SpreadElement>(
      AST_NODE_TYPES.SpreadElement,
    );
    expect(
      isJsxProducingExpression(
        node<TSESTree.Expression>(AST_NODE_TYPES.ArrayExpression, {
          elements: [NULL, spreadElement, numberLiteral],
        }),
      ),
    ).toBe(false);
  });

  it("inspects an arrow function body via expression and block", () => {
    expect(
      isJsxProducingExpression(
        node<TSESTree.Expression>(AST_NODE_TYPES.ArrowFunctionExpression, {
          body: jsxElement,
        }),
      ),
    ).toBe(true);
    const jsxReturnBody = blockStatement([returnStatement(jsxElement)]);
    expect(
      isJsxProducingExpression(
        node<TSESTree.Expression>(AST_NODE_TYPES.FunctionExpression, {
          body: jsxReturnBody,
        }),
      ),
    ).toBe(true);
  });

  it("inspects array-returning method callbacks", () => {
    const mapCallee = memberCallee("map");
    const mapCallback = node<TSESTree.ArrowFunctionExpression>(
      AST_NODE_TYPES.ArrowFunctionExpression,
      { body: jsxElement },
    );
    expect(
      isJsxProducingExpression(callExpression(mapCallee, [mapCallback])),
    ).toBe(true);
    const filterCallee = memberCallee("filter");
    const filterCallback = node<TSESTree.FunctionExpression>(
      AST_NODE_TYPES.FunctionExpression,
      {
        body: blockStatement([returnStatement(jsxFragment)]),
      },
    );
    expect(
      isJsxProducingExpression(callExpression(filterCallee, [filterCallback])),
    ).toBe(true);
  });

  it("returns false for an array-returning method with no usable callback", () => {
    const emptyMapCallee = memberCallee("map");
    expect(isJsxProducingExpression(callExpression(emptyMapCallee, []))).toBe(
      false,
    );
    const mapWithNumberCallee = memberCallee("map");
    expect(
      isJsxProducingExpression(
        callExpression(mapWithNumberCallee, [numberLiteral]),
      ),
    ).toBe(false);
  });

  it("returns false for a non-array-returning member call", () => {
    const reduceCallee = memberCallee("reduce");
    const reduceCallback = node<TSESTree.ArrowFunctionExpression>(
      AST_NODE_TYPES.ArrowFunctionExpression,
      { body: jsxElement },
    );
    expect(
      isJsxProducingExpression(callExpression(reduceCallee, [reduceCallback])),
    ).toBe(false);
  });

  it("returns false for a call whose callee is not a member expression", () => {
    const identifierCallee = node<TSESTree.Identifier>(
      AST_NODE_TYPES.Identifier,
    );
    const plainCallback = node<TSESTree.ArrowFunctionExpression>(
      AST_NODE_TYPES.ArrowFunctionExpression,
      { body: jsxElement },
    );
    expect(
      isJsxProducingExpression(
        callExpression(identifierCallee, [plainCallback]),
      ),
    ).toBe(false);
  });

  it("returns false for a member call whose property is not an identifier", () => {
    const literalMemberCallee = node<TSESTree.MemberExpression>(
      AST_NODE_TYPES.MemberExpression,
      {
        property: node<TSESTree.Literal>(AST_NODE_TYPES.Literal, {
          value: "map",
        }),
      },
    );
    expect(
      isJsxProducingExpression(callExpression(literalMemberCallee, [])),
    ).toBe(false);
  });

  it("unwraps as and satisfies expressions", () => {
    expect(
      isJsxProducingExpression(
        node<TSESTree.Expression>(AST_NODE_TYPES.TSAsExpression, {
          expression: jsxElement,
        }),
      ),
    ).toBe(true);
    expect(
      isJsxProducingExpression(
        node<TSESTree.Expression>(AST_NODE_TYPES.TSSatisfiesExpression, {
          expression: jsxFragment,
        }),
      ),
    ).toBe(true);
  });

  it("returns false for an unrelated expression", () => {
    expect(isJsxProducingExpression(numberLiteral)).toBe(false);
  });

  it("returns false for a block body with no jsx-producing return", () => {
    const mixedReturnBody = blockStatement([
      node<TSESTree.Statement>(AST_NODE_TYPES.ExpressionStatement),
      returnStatement(NULL),
      returnStatement(numberLiteral),
    ]);
    expect(
      isJsxProducingExpression(
        node<TSESTree.Expression>(AST_NODE_TYPES.ArrowFunctionExpression, {
          body: mixedReturnBody,
        }),
      ),
    ).toBe(false);
  });
});
