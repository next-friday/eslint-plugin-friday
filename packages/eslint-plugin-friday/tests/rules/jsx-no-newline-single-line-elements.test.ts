import rule from "../../src/rules/jsx-no-newline-single-line-elements.js";
import { createRuleTester, fixtureCode } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("jsx-no-newline-single-line-elements", rule, {
  valid: [
    {
      name: "single-line siblings without empty line",
      code: `
          <div>
            <div>One</div>
            <div>Two</div>
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "self-closing single-line siblings without empty line",
      code: `
          <div>
            <Header />
            <Main />
            <Footer />
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "multi-line siblings with empty line (not this rule's concern)",
      code: `
          <div>
            <div>
              Multi
            </div>

            <div>
              Line
            </div>
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "multi-line before single-line with empty line (mixed)",
      code: `
          <div>
            <div>
              Multi
            </div>

            <span>Single</span>
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "single-line before multi-line with empty line (mixed)",
      code: `
          <div>
            <span>Single</span>

            <div>
              Multi
            </div>
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "single-line siblings in fragment without empty line",
      code: `
          <>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </>
        `,
      filename: "Component.tsx",
    },
    {
      name: "single child element",
      code: `
          <div>
            <Panel>One</Panel>
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "expression between elements breaks adjacency",
      code: fixtureCode`
          <div>
            <Headerstrip />
            <Header />
            {children}
            <Footer />
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "conditional expression between elements breaks adjacency",
      code: `
          <div>
            <Header />
            {isLoading && <Spinner />}
            <Footer />
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "non-jsx file is ignored",
      code: `const value = 1;`,
      filename: "Component.ts",
    },
    {
      name: "empty fragment has no children to check",
      code: `<></>;`,
      filename: "Component.tsx",
    },
  ],
  invalid: [
    {
      name: "single-line siblings with empty line between",
      code: `
          <div>
            <div>One</div>

            <div>Two</div>
          </div>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "forbidNewline" }],
      output: `
          <div>
            <div>One</div>
            <div>Two</div>
          </div>
        `,
    },
    {
      name: "self-closing single-line siblings with empty line",
      code: `
          <div>
            <Header />

            <Footer />
          </div>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "forbidNewline" }],
      output: `
          <div>
            <Header />
            <Footer />
          </div>
        `,
    },
    {
      name: "multiple single-line siblings in fragment with empty lines",
      code: `
          <>
            <li>Item 1</li>

            <li>Item 2</li>

            <li>Item 3</li>
          </>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "forbidNewline" }, { messageId: "forbidNewline" }],
      output: `
          <>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </>
        `,
    },
    {
      name: "single-line panels with empty line",
      code: `
          <div>
            <Panel id="courses">Courses</Panel>

            <Panel id="news">News</Panel>
          </div>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "forbidNewline" }],
      output: `
          <div>
            <Panel id="courses">Courses</Panel>
            <Panel id="news">News</Panel>
          </div>
        `,
    },
  ],
});
