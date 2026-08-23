import { describe, expect, it } from "vitest";

import {
  hasAnySuffix,
  getBaseName,
  getBasename,
  isConfigFile,
  isJsxFile,
  isTestFile,
} from "../../src/text/filename.js";

describe("getBasename", () => {
  it("strips a POSIX directory prefix", () => {
    expect(getBasename("src/utils/filename.ts")).toBe("filename.ts");
  });

  it("strips a Windows directory prefix", () => {
    expect(getBasename(String.raw`src\utils\filename.ts`)).toBe("filename.ts");
  });

  it("returns a bare filename unchanged", () => {
    expect(getBasename("filename.ts")).toBe("filename.ts");
  });
});

describe("getBaseName", () => {
  it("drops the extension from a dotted filename", () => {
    expect(getBaseName("filename.ts")).toBe("filename");
  });

  it("keeps the full name when there is no dot", () => {
    expect(getBaseName("Makefile")).toBe("Makefile");
  });

  it("keeps the full name for a dotfile", () => {
    expect(getBaseName(".eslintrc")).toBe(".eslintrc");
  });
});

describe("hasAnySuffix", () => {
  it("is true when one suffix matches", () => {
    expect(hasAnySuffix("component.tsx", [".ts", ".tsx"])).toBe(true);
  });

  it("is false when no suffix matches", () => {
    expect(hasAnySuffix("component.js", [".ts", ".tsx"])).toBe(false);
  });
});

describe("isJsxFile", () => {
  it("is true for a jsx extension", () => {
    expect(isJsxFile("component.jsx")).toBe(true);
  });

  it("is true for a tsx extension", () => {
    expect(isJsxFile("component.tsx")).toBe(true);
  });

  it("is false for a ts extension", () => {
    expect(isJsxFile("component.ts")).toBe(false);
  });

  it("is false when there is no extension", () => {
    expect(isJsxFile("README")).toBe(false);
  });

  it("is false for a dotfile with no extension", () => {
    expect(isJsxFile(".eslintrc")).toBe(false);
  });
});

describe("isTestFile", () => {
  it("is true for a .test. segment", () => {
    expect(isTestFile("filename.test.ts")).toBe(true);
  });

  it("is true for a .spec. segment", () => {
    expect(isTestFile("filename.spec.ts")).toBe(true);
  });

  it("is true for a __tests__ directory", () => {
    expect(isTestFile("__tests__/filename.ts")).toBe(true);
  });

  it("is false for a plain source file", () => {
    expect(isTestFile("filename.ts")).toBe(false);
  });
});

describe("isConfigFile", () => {
  it("is true when the base name ends in a config suffix", () => {
    expect(isConfigFile("vitest.config.ts")).toBe(true);
  });

  it("is true when a config suffix is followed by an extension", () => {
    expect(isConfigFile("vitest.config.ts")).toBe(true);
  });

  it("is true for a leading dotfile config", () => {
    expect(isConfigFile(".eslintrc.json")).toBe(true);
  });

  it("is false for a plain source file", () => {
    expect(isConfigFile("filename.ts")).toBe(false);
  });
});
