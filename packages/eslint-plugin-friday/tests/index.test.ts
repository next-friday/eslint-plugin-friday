import { describe, expect, it } from "vitest";

import packageJson from "../package.json" with { type: "json" };
import plugin from "../src/index.js";

const PRESETS = [
  "base",
  "base/recommended",
  "react",
  "react/recommended",
  "all",
  "all/recommended",
] as const;

describe("plugin", () => {
  it("exposes meta with the package name", () => {
    expect(plugin.meta.name).toBe(packageJson.name);
  });

  it("exposes a rules map", () => {
    expect(plugin.rules).toBeTypeOf("object");
  });

  it("exposes the named config presets", () => {
    for (const preset of PRESETS) {
      expect(plugin.configs).toHaveProperty([preset]);
      expect(plugin.configs[preset]?.name).toBe(`friday/${preset}`);
    }
  });

  it("registers the plugin as friday in every preset", () => {
    for (const preset of PRESETS) {
      expect(Object.keys(plugin.configs[preset]?.plugins ?? {})).toEqual([
        "friday",
      ]);
    }
  });

  it("enables every rule in the all preset", () => {
    expect(Object.keys(plugin.configs.all?.rules ?? {})).toHaveLength(
      Object.keys(plugin.rules).length,
    );
  });

  it("generates every rule id in the friday namespace", () => {
    for (const preset of PRESETS) {
      const ruleIds = Object.keys(plugin.configs[preset]?.rules ?? {});
      for (const ruleId of ruleIds) {
        expect(ruleId.startsWith("friday/")).toBe(true);
      }
    }
  });

  it("never exposes the legacy next-friday namespace", () => {
    for (const preset of PRESETS) {
      const config = plugin.configs[preset];
      const pluginNames = Object.keys(config?.plugins ?? {});
      const ruleIds = Object.keys(config?.rules ?? {});
      expect(config?.name?.startsWith("next-friday/")).toBe(false);
      expect(pluginNames).not.toContain("next-friday");
      for (const ruleId of ruleIds) {
        expect(ruleId.startsWith("next-friday/")).toBe(false);
      }
    }
  });
});
