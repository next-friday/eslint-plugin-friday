import type {Rule} from "eslint";

export type JsxChild = {
  loc: {
    end: {line: number};
    start: {column: number; line: number};
  };
  range: [number, number];
  type: string;
  value?: string;
};

type JsxParent = {
  children: readonly JsxChild[];
};

const IGNORABLE_JSX_TEXT = /^[\t\n\r ]*$/u;

/**
 * Check whether a JSXText child contains only layout whitespace that React can ignore.
 * Unicode spacing characters such as non-breaking space remain significant content.
 * @param child JSX child to inspect.
 * @returns Whether the child is ignorable layout whitespace.
 */
export function isIgnorableJsxText(child: JsxChild): boolean {
  return child.type === "JSXText" && IGNORABLE_JSX_TEXT.test(child.value ?? "");
}

/**
 * Create visitors for JSX elements and fragments that pass their children to a rule check.
 * @param checkChildren Rule-specific check for the parent's JSX children.
 * @returns JSX element and fragment visitors.
 */
export function createJsxParentListener(
  checkChildren: (children: readonly JsxChild[]) => void,
): Pick<Rule.RuleListener, "JSXElement" | "JSXFragment"> {
  const visitJsxParent = (node: Rule.Node): void => {
    const {children} = node as unknown as JsxParent;

    if (children.length > 0) {
      checkChildren(children);
    }
  };

  return {
    JSXElement: visitJsxParent,
    JSXFragment: visitJsxParent,
  };
}
