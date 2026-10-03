import {RuleTester} from "eslint";
import {parser as typescriptParser} from "typescript-eslint";
import {describe, it} from "vitest";

import {noLazyIdentifiers} from "../../src/rules/no-lazy-identifiers";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {parser: typescriptParser},
});

ruleTester.run("no-lazy-identifiers", noLazyIdentifiers, {
  valid: [
    {
      code: 'const property = "value";\nconst _xxx = "ignored";\n',
      filename: "fixture.ts",
      name: "allows descriptive and underscore-prefixed identifiers",
    },
    {
      code: 'const myasdfvalue = "descriptive";\n',
      filename: "fixture.ts",
      name: "allows a keyboard sequence embedded inside a longer word",
    },
    {
      code: 'const asdf = "allowed";\n',
      filename: "fixture.ts",
      name: "honors the allow option",
      options: [{allow: ["asdf"]}],
    },
  ],
  invalid: [
    {
      code: 'const asdf = "keyboard";\nconst xxx = "placeholder";\n',
      errors: [{messageId: "noLazyIdentifier"}, {messageId: "noLazyIdentifier"}],
      filename: "fixture.ts",
      name: "reports repeated characters and keyboard-row runs",
    },
    {
      code: 'const fooAsdfBar = "keyboard";\n',
      errors: [{messageId: "noLazyIdentifier"}],
      filename: "fixture.ts",
      name: "reports a keyboard-row run isolated by identifier word boundaries",
    },
  ],
});
