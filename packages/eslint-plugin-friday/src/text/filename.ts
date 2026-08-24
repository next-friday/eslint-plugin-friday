export const getBasename = (filename: string): string => {
  const normalized = filename.replaceAll("\\", "/");
  const lastSlash = normalized.lastIndexOf("/");
  return lastSlash === -1 ? normalized : normalized.slice(lastSlash + 1);
};

const getFileExtension = (filename: string): string => {
  const base = getBasename(filename);
  const lastDot = base.lastIndexOf(".");
  return lastDot <= 0 ? "" : base.slice(lastDot + 1);
};

export const getBaseName = (filename: string): string => {
  const base = getBasename(filename);
  const lastDot = base.lastIndexOf(".");
  return lastDot <= 0 ? base : base.slice(0, lastDot);
};

export const hasAnySuffix = (
  filename: string,
  suffixes: readonly string[],
): boolean => suffixes.some((suffix) => filename.endsWith(suffix));

export const isJsxFile = (filename: string): boolean => {
  const extension = getFileExtension(filename);
  return extension === "jsx" || extension === "tsx";
};

export const isTestFile = (filename: string): boolean =>
  filename.includes(".test.") ||
  filename.includes(".spec.") ||
  filename.includes("__tests__");

export const isConfigFile = (filename: string): boolean => {
  const base = getBaseName(filename);
  return (
    /\.(config|rc|setup|spec|test)$/.test(base) ||
    /\.(config|rc|setup|spec|test)\./.test(filename) ||
    /^\.(eslintrc|babelrc|prettierrc)/.test(filename)
  );
};
