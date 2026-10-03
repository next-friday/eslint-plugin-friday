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
