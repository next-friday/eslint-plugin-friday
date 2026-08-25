import { PLUGIN_NAMESPACE } from "../constants/plugin-namespace.js";
import { withSeverity } from "./build-rules.js";
import type { FlatConfig, PluginShape, Severity } from "./types.js";

export const buildAll = (
  plugin: PluginShape,
  severity: Severity,
): FlatConfig => ({
  plugins: { [PLUGIN_NAMESPACE]: plugin },
  rules: withSeverity(Object.keys(plugin.rules), severity),
});
