import { PLUGIN_NAMESPACE } from "../constants/plugin-namespace.js";
import type { Severity } from "./types.js";

export const withSeverity = (
  ruleNames: readonly string[],
  severity: Severity,
): Record<string, Severity> =>
  Object.fromEntries(
    ruleNames.map((name) => [`${PLUGIN_NAMESPACE}/${name}`, severity]),
  );
