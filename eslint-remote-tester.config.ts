import friday from "eslint-plugin-friday";
import {
  getPathIgnorePattern,
  getRepositories,
} from "eslint-remote-tester-repositories";
import { parser } from "typescript-eslint";

const allRules = Object.fromEntries(
  Object.keys(friday.rules).map((name) => [`friday/${name}`, "error"]),
);

const config = {
  repositories: getRepositories({ randomize: true }),
  pathIgnorePattern: getPathIgnorePattern(),
  extensions: ["js", "jsx", "ts", "tsx"],
  concurrentTasks: 3,
  cache: false,
  logLevel: "info",
  eslintConfig: [
    {
      files: ["**/*.{ts,tsx,js,jsx}"],
      languageOptions: {
        parser,
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      plugins: { friday },
      rules: allRules,
    },
  ],
};

export default config;
