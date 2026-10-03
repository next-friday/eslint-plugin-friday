import {defineConfig} from "tsdown";

export default defineConfig({
  platform: "node",
  clean: true,
  dts: true,
  sourcemap: false,
  entry: {index: "src/index.ts"},
  format: ["esm"],
});
