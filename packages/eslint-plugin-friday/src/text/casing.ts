export const capitalize = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);

export const toScreamingSnakeCase = (name: string): string =>
  name
    .replaceAll(/([a-z])([A-Z])/g, "$1_$2")
    .replaceAll(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toUpperCase();

export const splitIdentifierWords = (name: string): string[] =>
  name
    .replaceAll(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replaceAll(/([a-zA-Z])(\d)/g, "$1 $2")
    .replaceAll(/(\d)([a-zA-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter((word) => word.length > 0);

export const isPascalCase = (name: string): boolean => /^[A-Z]/.test(name);

export const isHookName = (name: string): boolean =>
  name === "use" || /^use[A-Z]/.test(name);

export const stripSurroundingUnderscores = (name: string): string => {
  let start = 0;
  let end = name.length;
  while (start < end && name.charAt(start) === "_") {
    start += 1;
  }
  while (end > start && name.charAt(end - 1) === "_") {
    end -= 1;
  }
  return name.slice(start, end);
};

export const hasPrefixBoundary = (name: string, prefix: string): boolean => {
  if (!name.startsWith(prefix)) {
    return false;
  }

  if (name.length === prefix.length) {
    return true;
  }

  const nextChar = name.charAt(prefix.length);
  if (/\d/.test(nextChar)) {
    return true;
  }
  return (
    nextChar === nextChar.toUpperCase() && nextChar !== nextChar.toLowerCase()
  );
};

export const hasAnyPrefixBoundary = (
  name: string,
  prefixes: readonly string[],
): boolean => prefixes.some((prefix) => hasPrefixBoundary(name, prefix));
