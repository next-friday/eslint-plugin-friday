import type {Rule} from "eslint";

import {createJsxParentListener} from "../utils/jsx-children";
import type {JsxChild} from "../utils/jsx-children";
import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const MESSAGE_ID = "forbidNewline";

/**
 * Check whether two adjacent JSX children are single-line element siblings with an empty line.
 * @param current Previous significant JSX child.
 * @param next Next significant JSX child.
 * @returns Whether the gap should be collapsed.
 */
function canCollapseGap(current: JsxChild, next: JsxChild): boolean {
  const isCurrentElement = current.type === "JSXElement" || current.type === "JSXFragment";
  const isNextElement = next.type === "JSXElement" || next.type === "JSXFragment";

  if (!isCurrentElement || !isNextElement) {
    return false;
  }

  const isCurrentSingleLine = current.loc.start.line === current.loc.end.line;
  const isNextSingleLine = next.loc.start.line === next.loc.end.line;

  return isCurrentSingleLine && isNextSingleLine && next.loc.start.line - current.loc.end.line >= 2;
}

/**
 * Enforce compact spacing between adjacent single-line JSX element siblings.
 * @param context Active ESLint rule context.
 * @param children JSX children belonging to one element or fragment.
 */
function checkSiblings(context: Rule.RuleContext, children: readonly JsxChild[]): void {
  const elements = children.filter(
    child => child.type !== "JSXText" || (child.value ?? "").trim() !== "",
  );

  let index = 1;

  while (index < elements.length) {
    const current = elements[index - 1];
    const next = elements[index];

    if (current && next && canCollapseGap(current, next)) {
      context.report({
        messageId: MESSAGE_ID,
        fix(fixer) {
          const indent = " ".repeat(next.loc.start.column);

          return fixer.replaceTextRange([current.range[1], next.range[0]], `\n${indent}`);
        },
        node: next as unknown as Rule.Node,
      });
    }

    index += 1;
  }
}

export const jsxNoNewlineSingleLineElements: Rule.RuleModule = {
  create(context) {
    return createJsxParentListener(children => checkSiblings(context, children));
  },
  meta: {
    languages: ["js/js"],
    type: "layout",
    docs: {
      description: "disallow empty lines between adjacent single-line JSX elements or fragments",
      url: getRuleDocumentationUrl("jsx-no-newline-single-line-elements"),
    },
    fixable: "whitespace",
    messages: {
      [MESSAGE_ID]: "Unexpected empty line between adjacent single-line JSX elements or fragments.",
    },
    schema: [],
  },
};
