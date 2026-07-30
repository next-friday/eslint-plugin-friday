import rule from "../../src/rules/sort-imports.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("sort-imports", rule, {
  valid: [
    {
      name: "bare parent import '..' groups before relative",
      code: `import a from "..";\n\nimport b from "./local";`,
    },
    {
      name: "correct order: all groups with blank lines",
      code: `
import "./setup";

import fs from "node:fs";

import React from "react";

import { utils } from "@/lib/utils";

import { foo } from "../foo";`,
    },
    {
      name: "single import",
      code: `import React from "react";`,
    },
    {
      name: "all same group (external)",
      code: `
import React from "react";
import lodash from "lodash";
import { useState } from "react";`,
    },
    {
      name: "type imports follow their own group",
      code: `
import React from "react";
import type { FC } from "react";

import { foo } from "../foo";
import type { Bar } from "../foo";`,
    },
    {
      name: "multiple side-effect imports",
      code: `
import "./polyfill";
import "./setup";`,
    },
    {
      name: "builtin then external",
      code: `
import fs from "node:fs";
import path from "node:path";

import React from "react";`,
    },
    {
      name: "external then internal aliases (@/, ~/, #)",
      code: `
import React from "react";

import { helper } from "~/helpers";
import { token } from "#auth/token";
import { utils } from "@/lib/utils";`,
    },
    {
      name: "relative imports together",
      code: `
import { foo } from "../foo";

import { bar } from "./bar";`,
    },
    {
      name: "non-contiguous imports reset context",
      code: `
import React from "react";

const x = 1;

import { foo } from "../foo";`,
    },
    {
      name: "bare builtin module name (without node: prefix)",
      code: `
import fs from "fs";

import React from "react";`,
    },
    {
      name: "side-effect with scoped package",
      code: `
import "@scope/setup";

import React from "react";`,
    },
    {
      name: "type imports follow their own group across groups",
      code: `
import React from "react";
import type { Foo } from "react";

import { utils } from "@/lib/utils";

import type { Bar } from "../bar";`,
    },
    {
      name: "builtin type follows builtin value",
      code: `
import fs from "node:fs";
import type { Stats } from "node:fs";

import React from "react";`,
    },
    {
      name: "internal alias type follows internal alias value",
      code: `
import { utils } from "@/lib/utils";
import type { Util } from "@/lib/utils";

import { foo } from "../foo";`,
    },
    {
      name: "relative type follows relative value",
      code: `
import { bar } from "./bar";
import type { Bar } from "./bar";`,
    },
  ],
  invalid: [
    {
      name: "sorts external imports by complete declaration text",
      code: `
import friday from "eslint-plugin-friday";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { globalIgnores } from "eslint/config";
import globals from "globals";`,
      output: `
import friday from "eslint-plugin-friday";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { globalIgnores } from "eslint/config";`,
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "uses case-sensitive deterministic ordering",
      code: `
import alpha from "alpha";
import Zebra from "zebra";`,
      output: `
import Zebra from "zebra";
import alpha from "alpha";`,
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "group order takes precedence over declaration text",
      code: `
import zebra from "zebra";
import Alpha from "node:assert";`,
      output: [
        `
import Alpha from "node:assert";
import zebra from "zebra";`,
        `
import Alpha from "node:assert";

import zebra from "zebra";`,
      ],
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "sorts type-only imports within their subgroup",
      code: `
import type { Zebra } from "zebra";
import type { Alpha } from "alpha";`,
      output: `
import type { Alpha } from "alpha";
import type { Zebra } from "zebra";`,
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "moves multi-line declarations atomically",
      code: `
import {
  Zebra,
} from "zebra";
import {
  Alpha,
} from "alpha";`,
      output: `
import {
  Alpha,
} from "alpha";
import {
  Zebra,
} from "zebra";`,
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "skips autofix when a comment is present",
      code: `
import { foo } from "../foo";
// the react import
import React from "react";`,
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "relative before external",
      code: `
import { foo } from "../foo";
import React from "react";`,
      output: [
        `
import React from "react";
import { foo } from "../foo";`,
        `
import React from "react";

import { foo } from "../foo";`,
      ],
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "external before builtin",
      code: `
import React from "react";
import fs from "node:fs";`,
      output: [
        `
import fs from "node:fs";
import React from "react";`,
        `
import fs from "node:fs";

import React from "react";`,
      ],
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "side-effect after external",
      code: `
import React from "react";
import "./setup";`,
      output: [
        `
import "./setup";
import React from "react";`,
        `
import "./setup";

import React from "react";`,
      ],
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "internal alias before external",
      code: `
import { utils } from "@/lib/utils";
import React from "react";`,
      output: [
        `
import React from "react";
import { utils } from "@/lib/utils";`,
        `
import React from "react";

import { utils } from "@/lib/utils";`,
      ],
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "relative before internal alias",
      code: `
import { foo } from "../foo";
import { utils } from "@/lib/utils";`,
      output: [
        `
import { utils } from "@/lib/utils";
import { foo } from "../foo";`,
        `
import { utils } from "@/lib/utils";

import { foo } from "../foo";`,
      ],
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "relative before builtin (reports first violation only)",
      code: `
import { foo } from "./foo";
import fs from "node:fs";
import React from "react";`,
      output: [
        `
import fs from "node:fs";
import React from "react";
import { foo } from "./foo";`,
        `
import fs from "node:fs";

import React from "react";

import { foo } from "./foo";`,
      ],
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "type import before value import",
      code: `
import type { Foo } from "some-lib";
import { bar } from "other-lib";`,
      output: `
import { bar } from "other-lib";
import type { Foo } from "some-lib";`,
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "type imports interspersed with value imports",
      code: `
import type { FC } from "react";
import React from "react";
import type { Bar } from "../bar";
import { foo } from "../foo";`,
      output: [
        `
import React from "react";
import type { FC } from "react";
import { foo } from "../foo";
import type { Bar } from "../bar";`,
        `
import React from "react";
import type { FC } from "react";

import { foo } from "../foo";
import type { Bar } from "../bar";`,
      ],
      errors: [{ messageId: "unsortedImports" }],
    },
    {
      name: "missing blank line between external and parent relative",
      code: `
import React from "react";
import { foo } from "../foo";`,
      output: `
import React from "react";

import { foo } from "../foo";`,
      errors: [{ messageId: "missingBlankLine" }],
    },
    {
      name: "missing blank line between external type and parent relative",
      code: `
import React from "react";
import type { FC } from "react";
import { foo } from "../foo";`,
      output: `
import React from "react";
import type { FC } from "react";

import { foo } from "../foo";`,
      errors: [{ messageId: "missingBlankLine" }],
    },
  ],
});
