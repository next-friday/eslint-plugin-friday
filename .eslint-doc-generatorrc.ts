import type {GenerateOptions} from "eslint-doc-generator";
import prettier from "prettier";

const config = {
  ruleDocTitleFormat: "name",
  ruleListColumns: ["name", "description", "fixable"],
  async postprocess(content, path) {
    const fileInfo = await prettier.getFileInfo(path, {
      ignorePath: ".prettierignore",
    });

    if (fileInfo.ignored) {
      return content;
    }

    const options = await prettier.resolveConfig(path, {editorconfig: true});

    return prettier.format(content, {
      ...options,
      filepath: path,
    });
  },
} satisfies GenerateOptions;

export default config;
