import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { describe, expect, it } from "vitest";

import {
  hasComment,
  hasAncestor,
  isJsxElementOrFragment,
  isMultiLine,
  isNamedJsxElement,
  isReactComponentFunction,
  isSingleLine,
  isWhitespaceJsxText,
  unwrapTypeAssertion,
} from "../../src/ast/jsx.js";

const node = <NodeType>(
  type: AST_NODE_TYPES,
  properties: object = {},
): NodeType => ({ type, ...properties }) as unknown as NodeType;

const NULL = JSON.parse("null") as null;

const jsxElement = node<TSESTree.JSXElement>(AST_NODE_TYPES.JSXElement);

const jsxFragment = node<TSESTree.JSXFragment>(AST_NODE_TYPES.JSXFragment);

const numberLiteral = node<TSESTree.Literal>(AST_NODE_TYPES.Literal, {
  value: 1,
});

const withLoc = (startLine: number, endLine: number): TSESTree.Node =>
  node<TSESTree.Node>(AST_NODE_TYPES.JSXElement, {
    loc: { start: { line: startLine }, end: { line: endLine } },
  });

const returnStatement = (
  argument: TSESTree.Expression | null,
): TSESTree.ReturnStatement =>
  node<TSESTree.ReturnStatement>(AST_NODE_TYPES.ReturnStatement, { argument });

const blockStatement = (body: TSESTree.Statement[]): TSESTree.BlockStatement =>
  node<TSESTree.BlockStatement>(AST_NODE_TYPES.BlockStatement, { body });

const conditional = (
  consequent: TSESTree.Expression,
  alternate: TSESTree.Expression,
): TSESTree.ConditionalExpression =>
  node<TSESTree.ConditionalExpression>(AST_NODE_TYPES.ConditionalExpression, {
    consequent,
    alternate,
  });

const logical = (right: TSESTree.Expression): TSESTree.LogicalExpression =>
  node<TSESTree.LogicalExpression>(AST_NODE_TYPES.LogicalExpression, { right });

describe("isJsxElementOrFragment", () => {
  it("returns true for a jsx element and a jsx fragment", () => {
    expect(isJsxElementOrFragment(jsxElement)).toBe(true);
    expect(isJsxElementOrFragment(jsxFragment)).toBe(true);
  });

  it("returns false for an unrelated node", () => {
    expect(isJsxElementOrFragment(numberLiteral)).toBe(false);
  });
});

describe("isSingleLine", () => {
  it("returns true when start and end share a line", () => {
    expect(isSingleLine(withLoc(3, 3))).toBe(true);
  });

  it("returns false when start and end differ", () => {
    expect(isSingleLine(withLoc(3, 5))).toBe(false);
  });
});

describe("isMultiLine", () => {
  it("returns true when start and end differ", () => {
    expect(isMultiLine(withLoc(3, 5))).toBe(true);
  });

  it("returns false when start and end share a line", () => {
    expect(isMultiLine(withLoc(3, 3))).toBe(false);
  });
});

describe("isWhitespaceJsxText", () => {
  it("returns true for blank jsx text", () => {
    expect(
      isWhitespaceJsxText(
        node<TSESTree.JSXChild>(AST_NODE_TYPES.JSXText, { value: "  \n  " }),
      ),
    ).toBe(true);
  });

  it("returns false for jsx text with content", () => {
    expect(
      isWhitespaceJsxText(
        node<TSESTree.JSXChild>(AST_NODE_TYPES.JSXText, { value: "hello" }),
      ),
    ).toBe(false);
  });

  it("returns false for a non-text child", () => {
    expect(
      isWhitespaceJsxText(
        node<TSESTree.JSXChild>(AST_NODE_TYPES.JSXElement, { value: "  " }),
      ),
    ).toBe(false);
  });
});

describe("hasComment", () => {
  it("returns true for a line comment marker", () => {
    expect(hasComment("a // b")).toBe(true);
  });

  it("returns true for a block comment marker", () => {
    expect(hasComment("a /* b */")).toBe(true);
  });

  it("returns false for text with no comment marker", () => {
    expect(hasComment("a + b")).toBe(false);
  });
});

describe("unwrapTypeAssertion", () => {
  it("returns undefined for a null expression", () => {
    expect(unwrapTypeAssertion(NULL)).toBeUndefined();
  });

  it("returns a non-assertion expression unchanged", () => {
    expect(unwrapTypeAssertion(jsxElement)).toBe(jsxElement);
  });

  it("unwraps an as expression to the inner expression", () => {
    expect(
      unwrapTypeAssertion(
        node<TSESTree.Expression>(AST_NODE_TYPES.TSAsExpression, {
          expression: jsxElement,
        }),
      ),
    ).toBe(jsxElement);
  });

  it("unwraps nested satisfies and as expressions to the innermost node", () => {
    const asExpression = node<TSESTree.Expression>(
      AST_NODE_TYPES.TSAsExpression,
      {
        expression: jsxFragment,
      },
    );
    expect(
      unwrapTypeAssertion(
        node<TSESTree.Expression>(AST_NODE_TYPES.TSSatisfiesExpression, {
          expression: asExpression,
        }),
      ),
    ).toBe(jsxFragment);
  });
});

describe("isNamedJsxElement", () => {
  it("returns true when the element name matches", () => {
    const fragmentName = node<TSESTree.JSXIdentifier>(
      AST_NODE_TYPES.JSXIdentifier,
      {
        name: "Fragment",
      },
    );
    expect(
      isNamedJsxElement(
        node<TSESTree.Node>(AST_NODE_TYPES.JSXElement, {
          openingElement: {
            name: fragmentName,
          },
        }),
        "Fragment",
      ),
    ).toBe(true);
  });

  it("returns false when the element name differs", () => {
    const otherName = node<TSESTree.JSXIdentifier>(
      AST_NODE_TYPES.JSXIdentifier,
      {
        name: "Other",
      },
    );
    expect(
      isNamedJsxElement(
        node<TSESTree.Node>(AST_NODE_TYPES.JSXElement, {
          openingElement: {
            name: otherName,
          },
        }),
        "Fragment",
      ),
    ).toBe(false);
  });

  it("returns false when the opening name is not an identifier", () => {
    const memberExpressionName = node<TSESTree.Node>(
      AST_NODE_TYPES.JSXMemberExpression,
    );
    expect(
      isNamedJsxElement(
        node<TSESTree.Node>(AST_NODE_TYPES.JSXElement, {
          openingElement: {
            name: memberExpressionName,
          },
        }),
        "Fragment",
      ),
    ).toBe(false);
  });

  it("returns false for a non-element node", () => {
    expect(isNamedJsxElement(numberLiteral, "Fragment")).toBe(false);
  });
});

describe("hasAncestor", () => {
  it("returns true when an ancestor satisfies the predicate", () => {
    const grandparent = node<TSESTree.Node>(AST_NODE_TYPES.Program);
    const parent = node<TSESTree.Node>(AST_NODE_TYPES.BlockStatement, {
      parent: grandparent,
    });
    const child = node<TSESTree.Node>(AST_NODE_TYPES.Identifier, { parent });
    expect(
      hasAncestor(child, (current) => current.type === AST_NODE_TYPES.Program),
    ).toBe(true);
  });

  it("returns false when no ancestor satisfies the predicate", () => {
    const parent = node<TSESTree.Node>(AST_NODE_TYPES.BlockStatement);
    const child = node<TSESTree.Node>(AST_NODE_TYPES.Identifier, { parent });
    expect(
      hasAncestor(child, (current) => current.type === AST_NODE_TYPES.Program),
    ).toBe(false);
  });

  it("returns false when the node has no parent", () => {
    expect(
      hasAncestor(node<TSESTree.Node>(AST_NODE_TYPES.Identifier), () => true),
    ).toBe(false);
  });
});

describe("isReactComponentFunction", () => {
  it("returns true for an arrow function with a jsx body", () => {
    expect(
      isReactComponentFunction(
        node<TSESTree.ArrowFunctionExpression>(
          AST_NODE_TYPES.ArrowFunctionExpression,
          { body: jsxElement },
        ),
      ),
    ).toBe(true);
  });

  it("returns true for a block that returns jsx directly", () => {
    const directReturnBody = blockStatement([returnStatement(jsxFragment)]);
    expect(
      isReactComponentFunction(
        node<TSESTree.FunctionDeclaration>(AST_NODE_TYPES.FunctionDeclaration, {
          body: directReturnBody,
        }),
      ),
    ).toBe(true);
  });

  it("returns true for a block whose conditional consequent is jsx", () => {
    const conditionalConsequentBody = blockStatement([
      returnStatement(conditional(jsxElement, numberLiteral)),
    ]);
    expect(
      isReactComponentFunction(
        node<TSESTree.FunctionExpression>(AST_NODE_TYPES.FunctionExpression, {
          body: conditionalConsequentBody,
        }),
      ),
    ).toBe(true);
  });

  it("returns true for a block whose conditional alternate is jsx", () => {
    const conditionalAlternateBody = blockStatement([
      returnStatement(conditional(numberLiteral, jsxFragment)),
    ]);
    expect(
      isReactComponentFunction(
        node<TSESTree.FunctionExpression>(AST_NODE_TYPES.FunctionExpression, {
          body: conditionalAlternateBody,
        }),
      ),
    ).toBe(true);
  });

  it("returns true for a block that returns a jsx-producing logical expression", () => {
    const logicalJsxBody = blockStatement([
      returnStatement(logical(jsxElement)),
    ]);
    expect(
      isReactComponentFunction(
        node<TSESTree.FunctionExpression>(AST_NODE_TYPES.FunctionExpression, {
          body: logicalJsxBody,
        }),
      ),
    ).toBe(true);
  });

  it("returns false for a block whose logical return yields no jsx", () => {
    const logicalNonJsxBody = blockStatement([
      returnStatement(logical(numberLiteral)),
    ]);
    expect(
      isReactComponentFunction(
        node<TSESTree.FunctionExpression>(AST_NODE_TYPES.FunctionExpression, {
          body: logicalNonJsxBody,
        }),
      ),
    ).toBe(false);
  });

  it("returns false for an arrow function with a non-jsx expression body", () => {
    expect(
      isReactComponentFunction(
        node<TSESTree.ArrowFunctionExpression>(
          AST_NODE_TYPES.ArrowFunctionExpression,
          { body: numberLiteral },
        ),
      ),
    ).toBe(false);
  });

  it("returns false for a block with no jsx-producing return", () => {
    const asExpression0 = blockStatement([
      node<TSESTree.Statement>(AST_NODE_TYPES.ExpressionStatement),
      returnStatement(NULL),
      returnStatement(numberLiteral),
    ]);
    expect(
      isReactComponentFunction(
        node<TSESTree.FunctionDeclaration>(AST_NODE_TYPES.FunctionDeclaration, {
          body: asExpression0,
        }),
      ),
    ).toBe(false);
  });
});
