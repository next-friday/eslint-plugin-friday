import { createRule } from "../core/create-rule.js";

type NoJsFilesOptions = {
  allowList: string[];
};

type NoJsFilesMessageIds = "noJsFiles";

export default createRule<[NoJsFilesOptions], NoJsFilesMessageIds>({
  name: "no-js-files",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow .js and .jsx file extensions",
    },
    messages: {
      noJsFiles:
        "JavaScript files (.js/.jsx) are not allowed. Use TypeScript (.ts/.tsx) instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowList: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
            description:
              "List of filename patterns to exempt from the rule. Supports exact filenames and glob patterns using * as wildcard.",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ allowList: [] }],
  },
  defaultOptions: [{ allowList: [] }],
  create(context, [options]) {
    const { allowList } = options;
    const filename = context.filename;

    if (!filename) {
      return {};
    }

    const isJsFile = filename.endsWith(".js") || filename.endsWith(".jsx");
    if (!isJsFile) {
      return {};
    }

    const basename = filename.split("/").pop() ?? filename;
    const isAllowed = allowList.some((pattern: string) => {
      if (pattern.includes("*")) {
        const regex = new RegExp(`^${pattern.replaceAll("*", ".*")}$`);
        return regex.test(basename);
      }
      return basename === pattern;
    });

    if (isAllowed) {
      return {};
    }

    return {
      Program() {
        context.report({
          loc: { line: 1, column: 0 },
          messageId: "noJsFiles",
        });
      },
    };
  },
});
