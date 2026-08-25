import { PLUGIN_NAMESPACE } from "../constants/plugin-namespace.js";
import { withSeverity } from "./build-rules.js";
import type { FlatConfig, PluginShape, Severity } from "./types.js";

const REACT_RULES = [
  "prefer-readonly-component-properties",
  "jsx-newline-between-elements",
  "jsx-no-data-array",
  "jsx-no-data-object",
  "jsx-no-newline-single-line-elements",
  "jsx-no-non-component-function",
  "jsx-no-sub-interface",
  "jsx-require-suspense",
  "jsx-simple-properties",
  "jsx-sort-properties",
  "jsx-spread-properties-last",
  "no-ghost-wrapper",
  "prefer-interface-for-component-properties",
  "prefer-properties-with-children",
  "prefer-react-import-types",
] as const;

export const buildReact = (
  plugin: PluginShape,
  severity: Severity,
): FlatConfig => ({
  plugins: { [PLUGIN_NAMESPACE]: plugin },
  rules: withSeverity(REACT_RULES, severity),
});
