import { describe, expect, it } from "vitest";

import {
  capitalize,
  isHookName,
  isPascalCase,
  splitIdentifierWords,
  hasAnyPrefixBoundary,
  hasPrefixBoundary,
  stripSurroundingUnderscores,
  toScreamingSnakeCase,
} from "../../src/text/casing.js";

describe("capitalize", () => {
  it("uppercases the first character", () => {
    expect(capitalize("name")).toBe("Name");
  });

  it("leaves an already-capitalized word unchanged", () => {
    expect(capitalize("Name")).toBe("Name");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });
});

describe("toScreamingSnakeCase", () => {
  it("splits a lower-to-upper boundary", () => {
    expect(toScreamingSnakeCase("fooBar")).toBe("FOO_BAR");
  });

  it("splits an acronym followed by a word", () => {
    expect(toScreamingSnakeCase("HTTPServer")).toBe("HTTP_SERVER");
  });

  it("uppercases a single lowercase word", () => {
    expect(toScreamingSnakeCase("foo")).toBe("FOO");
  });
});

describe("splitIdentifierWords", () => {
  it("splits a camelCase name", () => {
    expect(splitIdentifierWords("myAsdfVar")).toStrictEqual([
      "my",
      "Asdf",
      "Var",
    ]);
  });

  it("splits an acronym boundary", () => {
    expect(splitIdentifierWords("XMLHttpRequest")).toStrictEqual([
      "XML",
      "Http",
      "Request",
    ]);
  });

  it("splits a letter-to-digit boundary", () => {
    expect(splitIdentifierWords("count4321")).toStrictEqual(["count", "4321"]);
  });

  it("returns a single-word name as one segment", () => {
    expect(splitIdentifierWords("property")).toStrictEqual(["property"]);
  });

  it("drops non-alphanumeric separators", () => {
    expect(splitIdentifierWords("foo_bar")).toStrictEqual(["foo", "bar"]);
  });
});

describe("isPascalCase", () => {
  it("is true when the first character is uppercase", () => {
    expect(isPascalCase("Name")).toBe(true);
  });

  it("is false when the first character is lowercase", () => {
    expect(isPascalCase("name")).toBe(false);
  });
});

describe("isHookName", () => {
  it("is true for the bare prefix", () => {
    expect(isHookName("use")).toBe(true);
  });

  it("is true for a prefixed uppercase name", () => {
    expect(isHookName("useState")).toBe(true);
  });

  it("is false for an unrelated name", () => {
    expect(isHookName("compute")).toBe(false);
  });

  it("is false for a lowercase continuation", () => {
    expect(isHookName("user")).toBe(false);
  });
});

describe("stripSurroundingUnderscores", () => {
  it("removes leading underscores", () => {
    expect(stripSurroundingUnderscores("__name")).toBe("name");
  });

  it("removes trailing underscores", () => {
    expect(stripSurroundingUnderscores("name__")).toBe("name");
  });

  it("removes both leading and trailing underscores", () => {
    expect(stripSurroundingUnderscores("__name__")).toBe("name");
  });

  it("leaves an unwrapped name unchanged", () => {
    expect(stripSurroundingUnderscores("name")).toBe("name");
  });

  it("collapses an all-underscore name to empty", () => {
    expect(stripSurroundingUnderscores("___")).toBe("");
  });

  it("returns an empty string unchanged", () => {
    expect(stripSurroundingUnderscores("")).toBe("");
  });
});

describe("hasPrefixBoundary", () => {
  it("is false when the name does not start with the prefix", () => {
    expect(hasPrefixBoundary("compute", "render")).toBe(false);
  });

  it("is true when the name equals the prefix", () => {
    expect(hasPrefixBoundary("render", "render")).toBe(true);
  });

  it("is true when a digit follows the prefix", () => {
    expect(hasPrefixBoundary("render2", "render")).toBe(true);
  });

  it("is true when an uppercase letter follows the prefix", () => {
    expect(hasPrefixBoundary("renderItem", "render")).toBe(true);
  });

  it("is false when a lowercase letter follows the prefix", () => {
    expect(hasPrefixBoundary("renderer", "render")).toBe(false);
  });

  it("is false when a caseless character follows the prefix", () => {
    expect(hasPrefixBoundary("render_", "render")).toBe(false);
  });
});

describe("hasAnyPrefixBoundary", () => {
  it("is true when one prefix matches at a boundary", () => {
    expect(hasAnyPrefixBoundary("isActive", ["has", "is"])).toBe(true);
  });

  it("is true when the name equals a prefix", () => {
    expect(hasAnyPrefixBoundary("is", ["has", "is"])).toBe(true);
  });

  it("is false when no prefix matches", () => {
    expect(hasAnyPrefixBoundary("active", ["has", "is"])).toBe(false);
  });
});
