import type {Rule} from "eslint";

import {createJsxParentListener} from "../utils/jsx-children";
import type {JsxChild} from "../utils/jsx-children";
import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const MESSAGE_ID = "requireNewline";

const SIGNIFICANT_JSX_CHILD_TYPES = new Set([
  "JSXElement",
  "JSXExpressionContainer",
  "JSXFragment",
]);

/**
 * Check whether adjacent significant JSX children need a separating empty line.
 * @param current Previous significant JSX child.
 * @param next Next significant JSX child.
 * @returns Whether at least one child is multi-line and no empty line exists.
 */
function canRequireGap(current: JsxChild, next: JsxChild): boolean {
  if (
    !SIGNIFICANT_JSX_CHILD_TYPES.has(current.type) ||
    !SIGNIFICANT_JSX_CHILD_TYPES.has(next.type)
  ) {
    return false;
  }

  const isCurrentMultiLine = current.loc.start.line !== current.loc.end.line;
  const isNextMultiLine = next.loc.start.line !== next.loc.end.line;
  const hasGap = next.loc.start.line - current.loc.end.line >= 2;

  return (isCurrentMultiLine || isNextMultiLine) && !hasGap;
}

/**
 * Enforce blank lines around multi-line JSX siblings.
 * @param context Active ESLint rule context.
 * @param children JSX children belonging to one element or fragment.
 */
function checkSiblings(context: Rule.RuleContext, children: readonly JsxChild[]): void {
  const siblings = children.filter(
    child => child.type !== "JSXText" || (child.value ?? "").trim() !== "",
  );
  let index = 0;

  while (index < siblings.length - 1) {
    const current = siblings[index];
    const next = siblings[index + 1];

    if (current && next && canRequireGap(current, next)) {
      context.report({
        messageId: MESSAGE_ID,
        fix(fixer) {
          return fixer.insertTextAfter(current, "\n");
        },
        node: next as unknown as Rule.Node,
      });
    }

    index += 1;
  }
}

export const jsxNewlineBetweenElements: Rule.RuleModule = {
  create(context) {
    return createJsxParentListener(children => checkSiblings(context, children));
  },
  meta: {
    languages: ["js/js"],
    type: "layout",
    docs: {
      description:
        "require empty lines between adjacent JSX elements, fragments, or expression containers when either is multi-line",
      url: getRuleDocumentationUrl("jsx-newline-between-elements"),
    },
    fixable: "whitespace",
    messages: {
      [MESSAGE_ID]:
        "Expected empty line between adjacent JSX elements, fragments, or expression containers.",
    },
    schema: [],
  },
};
