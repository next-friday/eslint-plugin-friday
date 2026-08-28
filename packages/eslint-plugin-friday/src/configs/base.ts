import { PLUGIN_NAMESPACE } from "../constants/plugin-namespace.js";
import { withSeverity } from "./build-rules.js";
import type { FlatConfig, PluginShape, Severity } from "./types.js";

const BASE_RULES = [
  "boolean-naming",
  "constant-case",
  "hook-filename",
  "hook-naming",
  "properties-suffix",
  "render-naming",
  "no-misleading-service-prefix",
  "sort-destructuring",
  "test-filename",
  "type-declaration-order",
  "index-export-only",
  "no-complex-inline-return",
  "no-direct-date",
  "no-emoji",
  "no-environment-fallback",
  "no-inline-nested-object",
  "no-inline-return-properties",
  "no-lazy-identifiers",
  "no-logic-in-parameters",
  "no-magic-numbers",
  "no-misleading-constant-case",
  "no-nested-interface-declaration",
  "prefer-destructuring-parameters",
  "prefer-guard-clause",
  "prefer-inline-literal-union",
  "prefer-interface-over-inline-types",
  "prefer-named-parameter-types",
  "sort-exports",
  "sort-imports",
  "sort-type-alphabetically",
  "sort-type-required-first",
] as const;

export const buildBase = (
  plugin: PluginShape,
  severity: Severity,
): FlatConfig => ({
  plugins: { [PLUGIN_NAMESPACE]: plugin },
  rules: withSeverity(BASE_RULES, severity),
});
