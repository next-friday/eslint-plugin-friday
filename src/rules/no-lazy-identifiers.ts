import type {Rule} from "eslint";

import {getRuleDocumentationUrl} from "../utils/rule-doc-url";

const MESSAGE_ID = "noLazyIdentifier";
const MIN_LENGTH = 3;
const MIN_SEQUENCE_LENGTH = 4;

const CHECKED_DEFINITION_TYPES = new Set([
  "CatchClause",
  "ClassName",
  "FunctionName",
  "Parameter",
  "Type",
  "Variable",
]);

const KEYBOARD_RUNS = [
  "qwertyuiop",
  "poiuytrewq",
  "asdfghjkl",
  "lkjhgfdsa",
  "zxcvbnm",
  "mnbvcxz",
  "1234567890",
  "0987654321",
] as const;

type ScopeDefinition = {
  type: string;
};

type ScopeIdentifier = {
  name: string;
};

type ScopeManager = {
  scopes: {
    variables: ScopeVariable[];
  }[];
};

type ScopeVariable = {
  defs: ScopeDefinition[];
  identifiers: ScopeIdentifier[];
};

type SourceCodeWithScopeManager = {
  scopeManager?: ScopeManager;
};

/**
 * Split an identifier into semantic camel-case, acronym, numeric, and separator-delimited words.
 * @param name Identifier name to split.
 * @returns Identifier word segments used for keyboard-run detection.
 */
function getIdentifierWords(name: string): string[] {
  return name
    .replaceAll(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replaceAll(/([a-z])(\d)/gi, "$1 $2")
    .replaceAll(/(\d)([a-z])/gi, "$1 $2")
    .split(/[^a-z0-9]+/i)
    .filter(word => word.length > 0);
}

/**
 * Check whether an identifier contains the same character three times consecutively.
 * @param name Identifier name to inspect.
 * @returns Whether the identifier contains a repeated-character run.
 */
function hasRepeatedCharacters(name: string): boolean {
  const characters = [...name];

  return characters.some(
    (character, index) =>
      index <= characters.length - 3 &&
      character === characters[index + 1] &&
      character === characters[index + 2],
  );
}

/**
 * Check whether an identifier segment is a keyboard-row run in either direction.
 * @param segment Identifier segment to inspect.
 * @returns Whether the segment is a keyboard-row run.
 */
function isKeyboardRun(segment: string): boolean {
  const normalized = segment.toLowerCase();

  return (
    normalized.length >= MIN_SEQUENCE_LENGTH && KEYBOARD_RUNS.some(run => run.includes(normalized))
  );
}

/**
 * Determine whether an identifier is a lazy placeholder name.
 * @param name Identifier name to inspect.
 * @returns Whether the identifier should be rejected.
 */
function isLazyIdentifier(name: string): boolean {
  return (
    name.length >= MIN_LENGTH &&
    !name.startsWith("_") &&
    (hasRepeatedCharacters(name) ||
      getIdentifierWords(name).some(segment => isKeyboardRun(segment)))
  );
}

export const noLazyIdentifiers: Rule.RuleModule = {
  create(context) {
    const [options] = context.options as [{allow?: string[]}?];
    const allowed = new Set(options?.allow);
    const sourceCode = context.sourceCode as unknown as SourceCodeWithScopeManager;

    const checkIdentifier = (identifier: ScopeIdentifier): void => {
      if (!allowed.has(identifier.name) && isLazyIdentifier(identifier.name)) {
        context.report({
          messageId: MESSAGE_ID,
          data: {name: identifier.name},
          node: identifier as unknown as Rule.Node,
        });
      }
    };

    const checkProgram = (): void => {
      const variables = sourceCode.scopeManager?.scopes.flatMap(scope => scope.variables) ?? [];

      const identifiers = variables
        .filter(variable =>
          variable.defs.some(definition => CHECKED_DEFINITION_TYPES.has(definition.type)),
        )
        .flatMap(variable => variable.identifiers);

      const uniqueIdentifiers = [...new Set(identifiers)];
      let index = 0;

      while (index < uniqueIdentifiers.length) {
        const identifier = uniqueIdentifiers[index] as ScopeIdentifier;

        index += 1;
        checkIdentifier(identifier);
      }
    };

    return {"Program:exit": checkProgram};
  },
  meta: {
    languages: ["js/js"],
    type: "problem",
    docs: {
      description:
        "disallow lazy placeholder identifiers such as repeated characters and keyboard-row runs",
      url: getRuleDocumentationUrl("no-lazy-identifiers"),
    },
    defaultOptions: [{allow: []}],
    messages: {
      [MESSAGE_ID]:
        "Avoid lazy identifier '{{name}}'. Use a descriptive name that clearly indicates its purpose.",
    },
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          allow: {
            description: "Identifier names explicitly exempt from this rule.",
            type: "array",
            uniqueItems: true,
            items: {type: "string"},
          },
        },
      },
    ],
  },
};
