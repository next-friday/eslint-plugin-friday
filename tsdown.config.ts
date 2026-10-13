import {defineConfig} from "tsdown";

const config = defineConfig({
  platform: "node",
  clean: true,
  dts: true,
  sourcemap: false,
  entry: {index: "src/index.ts"},
  format: ["esm"],
});

export default config;
