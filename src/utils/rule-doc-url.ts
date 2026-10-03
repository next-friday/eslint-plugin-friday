const RULE_DOC_BASE_URL =
  "https://github.com/next-friday/eslint-plugin-friday/blob/main/docs/rules";

export function getRuleDocumentationUrl(ruleName: string): string {
  return `${RULE_DOC_BASE_URL}/${ruleName}.md`;
}
