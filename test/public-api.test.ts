import {describe, expect, it} from "vitest";

import packageJson from "../package.json" with {type: "json"};
import plugin from "../src/index";

const RULE_NAMES = [
  "component-module",
  "index-export-only",
  "jsx-newline-between-elements",
  "jsx-no-newline-single-line-elements",
  "named-props",
  "no-lazy-identifiers",
  "object-curly-newline",
  "props-in-body",
] as const;

describe("public API", () => {
  it("exports the stable Next Friday plugin identity", () => {
    expect(plugin.meta?.name).toBe("@next-friday/eslint-plugin-friday");
    expect(plugin.meta?.namespace).toBe("friday");
    expect(plugin.meta?.version).toBe(packageJson.version);
  });

  it("exports exactly the established public rule IDs", () => {
    expect(Object.keys(plugin.rules ?? {}).toSorted((a, b) => a.localeCompare(b))).toEqual(
      [...RULE_NAMES].toSorted((a, b) => a.localeCompare(b)),
    );
  });
});
