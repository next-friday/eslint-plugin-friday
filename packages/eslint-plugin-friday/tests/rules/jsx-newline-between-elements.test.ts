import rule from "../../src/rules/jsx-newline-between-elements.js";
import { createRuleTester, fixtureCode } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("jsx-newline-between-elements", rule, {
  valid: [
    {
      name: "sibling multi-line divs with empty line between",
      code: `
          <div>
            <div>
              <HomeHighlight />
            </div>

            <div>
              <HomeEvents />
              <HomeNews />
              <HomeAbout />
            </div>
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "single-line list items do not require empty lines",
      code: `
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        `,
      filename: "Component.tsx",
    },
    {
      name: "multi-line list items with empty lines",
      code: `
          <ul>
            <li>
              Item 1
            </li>

            <li>
              Item 2
            </li>
          </ul>
        `,
      filename: "Component.tsx",
    },
    {
      name: "single-line elements in fragment do not require empty lines",
      code: `
          <>
            <Header>content</Header>
            <Main>content</Main>
            <Footer>content</Footer>
          </>
        `,
      filename: "Component.tsx",
    },
    {
      name: "single block child element",
      code: `
          <div>
            <SingleChild>content</SingleChild>
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "single-line p and h3 do not require empty lines",
      code: `
          <div>
            <p>Text content</p>
            <h3>Heading</h3>
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "single-line self-closing components do not require empty lines",
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
      name: "multi-line self-closing with empty line before sibling",
      code: `
          <div>
            <Input
              type="text"
              placeholder="Search"
            />

            <Button>Submit</Button>
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "multi-line p followed by single-line h3 with empty line",
      code: `
          <div>
            <p>
              Long text content
            </p>

            <h3>Heading</h3>
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "multi-line expression containers with empty line between",
      code: fixtureCode`
          <div>
            {studentId && (
              <div>
                <Text>{studentId}</Text>
              </div>
            )}

            {name && (
              <div>
                <Text>{name}</Text>
              </div>
            )}
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "multi-line expression container followed by element with empty line",
      code: fixtureCode`
          <div>
            {studentId && (
              <div>
                <Text>{studentId}</Text>
              </div>
            )}

            <div>
              <Text>Static</Text>
            </div>
          </div>
        `,
      filename: "Component.tsx",
    },
    {
      name: "non-jsx file is skipped",
      code: "const value = 1;",
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
      name: "missing empty line between multi-line sibling divs",
      code: `
          <div>
            <div>
              <HomeHighlight />
            </div>
            <div>
              <HomeEvents />
            </div>
          </div>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "requireNewline" }],
      output: `
          <div>
            <div>
              <HomeHighlight />
            </div>

            <div>
              <HomeEvents />
            </div>
          </div>
        `,
    },
    {
      name: "missing empty lines between multi-line list items",
      code: `
          <ul>
            <li>
              Item 1
            </li>
            <li>
              Item 2
            </li>
            <li>
              Item 3
            </li>
          </ul>
        `,
      filename: "Component.tsx",
      errors: [
        { messageId: "requireNewline" },
        { messageId: "requireNewline" },
      ],
      output: `
          <ul>
            <li>
              Item 1
            </li>

            <li>
              Item 2
            </li>

            <li>
              Item 3
            </li>
          </ul>
        `,
    },
    {
      name: "missing empty line between multi-line elements in fragment",
      code: `
          <>
            <Header>
              content
            </Header>
            <Main>
              content
            </Main>
          </>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "requireNewline" }],
      output: `
          <>
            <Header>
              content
            </Header>

            <Main>
              content
            </Main>
          </>
        `,
    },
    {
      name: "multi-line p before single-line h3 needs empty line",
      code: `
          <div>
            <p>
              Text
            </p>
            <h3>Heading</h3>
          </div>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "requireNewline" }],
      output: `
          <div>
            <p>
              Text
            </p>

            <h3>Heading</h3>
          </div>
        `,
    },
    {
      name: "single-line before multi-line needs empty line",
      code: `
          <div>
            <First>a</First>
            <Second>
              b
            </Second>

            <Third>c</Third>
          </div>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "requireNewline" }],
      output: `
          <div>
            <First>a</First>

            <Second>
              b
            </Second>

            <Third>c</Third>
          </div>
        `,
    },
    {
      name: "multi-line self-closing before sibling needs empty line",
      code: `
          <div>
            <Input
              type="text"
              placeholder="Search"
            />
            <Button>Submit</Button>
          </div>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "requireNewline" }],
      output: `
          <div>
            <Input
              type="text"
              placeholder="Search"
            />

            <Button>Submit</Button>
          </div>
        `,
    },
    {
      name: "single-line self-closing before multi-line sibling needs empty line",
      code: `
          <div>
            <hr />
            <section>
              content
            </section>
          </div>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "requireNewline" }],
      output: `
          <div>
            <hr />

            <section>
              content
            </section>
          </div>
        `,
    },
    {
      name: "missing empty line between multi-line expression containers",
      code: fixtureCode`
          <div>
            {studentId && (
              <div>
                <Text>{studentId}</Text>
              </div>
            )}
            {name && (
              <div>
                <Text>{name}</Text>
              </div>
            )}
          </div>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "requireNewline" }],
      output: fixtureCode`
          <div>
            {studentId && (
              <div>
                <Text>{studentId}</Text>
              </div>
            )}

            {name && (
              <div>
                <Text>{name}</Text>
              </div>
            )}
          </div>
        `,
    },
    {
      name: "missing empty line between expression container and element",
      code: fixtureCode`
          <div>
            {studentId && (
              <div>
                <Text>{studentId}</Text>
              </div>
            )}
            <div>
              <Text>Static</Text>
            </div>
          </div>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "requireNewline" }],
      output: fixtureCode`
          <div>
            {studentId && (
              <div>
                <Text>{studentId}</Text>
              </div>
            )}

            <div>
              <Text>Static</Text>
            </div>
          </div>
        `,
    },
    {
      name: "comment between siblings is reported but not autofixed",
      code: `
          <div>
            <First>
              a
            </First> /* keep */
            <Second>
              b
            </Second>
          </div>
        `,
      filename: "Component.tsx",
      errors: [{ messageId: "requireNewline" }],
    },
  ],
});
