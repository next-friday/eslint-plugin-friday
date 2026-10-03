import eslint from "@eslint/js";
import {defineConfig, globalIgnores} from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import packageJson from "eslint-plugin-package-json";
import unicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores(["dist/**", "coverage/**"]),
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  unicorn.configs.recommended,
  packageJson.configs.recommended,
  {
    files: ["package.json"],
    rules: {
      "package-json/sort-collections": [
        "error",
        [
          "scripts",
          {
            key: "exports",
            order: ["types", "import", "default"],
          },
        ],
      ],
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "unicorn/name-replacements": [
        "error",
        {
          replacements: {
            doc: false,
            props: false,
          },
        },
      ],
    },
  },
  {
    files: ["test/**/*.ts"],
    rules: {
      "unicorn/no-null": "off",
    },
  },
  {
    ...eslintPlugin.configs.recommended,
    files: ["src/rules/**/*.ts"],
  },
  {
    files: ["src/rules/**/*.ts"],
    plugins: {"eslint-plugin": eslintPlugin},
    rules: {
      "eslint-plugin/require-meta-docs-description": "error",
      "eslint-plugin/require-meta-docs-url": "error",
      "eslint-plugin/require-meta-schema": "error",
    },
  },
  eslintConfigPrettier,
);
