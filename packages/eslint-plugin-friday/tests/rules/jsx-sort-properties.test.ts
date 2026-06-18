import rule from "../../src/rules/jsx-sort-properties.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("jsx-sort-properties", rule, {
  valid: [
    {
      name: "correctly ordered props (all 8 groups)",
      code: `<Component title="hello" aria-label="label" count={100} value={someVar} style={{ color: "red" }} onClick={() => {}} icon={<Icon />} disabled />`,
      filename: "Component.tsx",
    },
    {
      name: "single prop",
      code: `<Component title="hello" />`,
      filename: "Component.tsx",
    },
    {
      name: "multiple props of the same type",
      code: `<Component title="hello" name="world" />`,
      filename: "Component.tsx",
    },
    {
      name: "multiple number/boolean/null props",
      code: `<Component count={42} enabled={true} value={null} />`,
      filename: "Component.tsx",
    },
    {
      name: "string before number before expression",
      code: `<Component title="hello" count={42} value={someVar} />`,
      filename: "Component.tsx",
    },
    {
      name: "reset ordering after spread attribute",
      code: `<Component onClick={() => {}} disabled {...props} title="hello" />`,
      filename: "Component.tsx",
    },
    {
      name: "spread-only element",
      code: `<Component {...props} />`,
      filename: "Component.tsx",
    },
    {
      name: "template literals as strings",
      code: `<Component title="hello" name={\`template\`} />`,
      filename: "Component.tsx",
    },
    {
      name: "undefined as number/boolean/null group",
      code: `<Component value={undefined} />`,
      filename: "Component.tsx",
    },
    {
      name: "array before object in same group",
      code: `<Component items={[1, 2]} data={{ key: "val" }} />`,
      filename: "Component.tsx",
    },
    {
      name: "multiple functions in same group",
      code: `<Component onClick={() => {}} onChange={function() {}} />`,
      filename: "Component.tsx",
    },
    {
      name: "JSX element and fragment in same group",
      code: `<Component icon={<Icon />} extra={<><span /></>} />`,
      filename: "Component.tsx",
    },
    {
      name: "all-unknown props (identifiers)",
      code: `<Component value={someVar} handler={someHandler} />`,
      filename: "Component.tsx",
    },
    {
      name: "string before expression before shorthand",
      code: `<Component title="hello" value={someVar} disabled />`,
      filename: "Component.tsx",
    },
    {
      name: "shorthand before spread then string after spread",
      code: `<Component disabled {...overrides} title="hello" count={42} />`,
      filename: "Component.tsx",
    },
    {
      name: "all eight groups in order",
      code: `<Component title="hello" aria-label="label" count={42} value={ref} items={[1]} onClick={() => {}} icon={<A />} active />`,
      filename: "Component.tsx",
    },
    {
      name: "expressions before shorthand",
      code: `<Component className="cover" src={src} alt={alt} sizes={sizes} fill />`,
      filename: "Component.tsx",
    },
    {
      name: "string before hyphenated strings",
      code: `<Component title="hello" aria-label="label" data-slot="slot" />`,
      filename: "Component.tsx",
    },
    {
      name: "multiple hyphenated strings",
      code: `<Component aria-label="label" data-slot="slot" />`,
      filename: "Component.tsx",
    },
    {
      name: "string then hyphenated string then expressions",
      code: `<Component sample="sample" aria-label="Previous page" data-slot="pagination-prev" className={itemClass} isDisabled={isDisabled} onPress={handlePress} />`,
      filename: "Component.tsx",
    },
    {
      name: "non-jsx filename is ignored",
      code: `<Component disabled title="hello" />`,
      filename: "Component.js",
    },
    {
      name: "empty expression container is ignored",
      code: `<Component first={} title="hello" />`,
      filename: "Component.tsx",
    },
    {
      name: "jsx element as direct attribute value is ignored",
      code: `<Component first=<Icon /> title="hello" />`,
      filename: "Component.tsx",
    },
    {
      name: "jsx fragment as direct attribute value is ignored",
      code: `<Component first=<></> title="hello" />`,
      filename: "Component.tsx",
    },
    {
      name: "string literal inside expression container groups as string",
      code: `<Component title={"hello"} aria-label="label" />`,
      filename: "Component.tsx",
    },
  ],
  invalid: [
    {
      name: "unsorted props with a comment are reported but not auto-fixed",
      code: `<Component value={x} /* keep */ title="hello" />`,
      filename: "Component.tsx",
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "shorthand before string",
      code: `<Component disabled title="hello" />`,
      filename: "Component.tsx",
      output: `<Component title="hello" disabled />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "function before number",
      code: `<Component onClick={() => {}} count={42} />`,
      filename: "Component.tsx",
      output: `<Component count={42} onClick={() => {}} />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "JSX before object",
      code: `<Component icon={<Icon />} style={{ color: "red" }} />`,
      filename: "Component.tsx",
      output: `<Component style={{ color: "red" }} icon={<Icon />} />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "shorthand before string and number",
      code: `<Component disabled title="hello" count={42} />`,
      filename: "Component.tsx",
      output: `<Component title="hello" count={42} disabled />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "function before string",
      code: `<Component onClick={() => {}} title="hello" />`,
      filename: "Component.tsx",
      output: `<Component title="hello" onClick={() => {}} />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "error after spread when order is wrong",
      code: `<Component title="hello" {...props} disabled name="world" />`,
      filename: "Component.tsx",
      output: `<Component title="hello" {...props} name="world" disabled />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "shorthand before function",
      code: `<Component active onClick={() => {}} />`,
      filename: "Component.tsx",
      output: `<Component onClick={() => {}} active />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "array before number",
      code: `<Component items={[1, 2]} count={42} />`,
      filename: "Component.tsx",
      output: `<Component count={42} items={[1, 2]} />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "shorthand before expression",
      code: `<Component className="cover" fill sizes={sizes} />`,
      filename: "Component.tsx",
      output: `<Component className="cover" sizes={sizes} fill />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "expression before string",
      code: `<Component value={someVar} title="hello" />`,
      filename: "Component.tsx",
      output: `<Component title="hello" value={someVar} />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "expression after shorthand",
      code: `<Component className="cover" src={src} alt={alt} fill sizes={sizes} />`,
      filename: "Component.tsx",
      output: `<Component className="cover" src={src} alt={alt} sizes={sizes} fill />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "hyphenated string before string",
      code: `<Component aria-label="label" title="hello" />`,
      filename: "Component.tsx",
      output: `<Component title="hello" aria-label="label" />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "hyphenated string after expression",
      code: `<Component sample="sample" aria-label="Previous page" className={itemClass} data-slot="pagination-prev" />`,
      filename: "Component.tsx",
      output: `<Component sample="sample" aria-label="Previous page" data-slot="pagination-prev" className={itemClass} />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "spread first then unsorted segment",
      code: `<Component {...props} disabled title="hello" />`,
      filename: "Component.tsx",
      output: `<Component {...props} title="hello" disabled />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "unsorted segment before trailing spread",
      code: `<Component disabled title="hello" {...props} />`,
      filename: "Component.tsx",
      output: `<Component title="hello" disabled {...props} />`,
      errors: [{ messageId: "unsortedProps" }],
    },
    {
      name: "unsorted segment containing empty expression value",
      code: `<Component onClick={() => {}} first={} title="hello" />`,
      filename: "Component.tsx",
      output: `<Component first={} title="hello" onClick={() => {}} />`,
      errors: [{ messageId: "unsortedProps" }],
    },
  ],
});
