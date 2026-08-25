import packageJson from "../package.json" with { type: "json" };

import { buildAll } from "./configs/all.js";
import { buildBase } from "./configs/base.js";
import { buildReact } from "./configs/react.js";
import type { FlatConfig } from "./configs/types.js";
import { PLUGIN_NAMESPACE } from "./constants/plugin-namespace.js";
import { rules } from "./rules/index.js";

const meta = { name: packageJson.name, version: packageJson.version } as const;

const plugin = {
  meta,
  rules,
  configs: {} as Record<string, FlatConfig>,
};

const presets: Record<string, FlatConfig> = {
  base: buildBase(plugin, "warn"),
  "base/recommended": buildBase(plugin, "error"),
  react: buildReact(plugin, "warn"),
  "react/recommended": buildReact(plugin, "error"),
  all: buildAll(plugin, "warn"),
  "all/recommended": buildAll(plugin, "error"),
};

plugin.configs = Object.fromEntries(
  Object.entries(presets).map(([name, config]) => [
    name,
    { ...config, name: `${PLUGIN_NAMESPACE}/${name}` },
  ]),
);

export default plugin;
