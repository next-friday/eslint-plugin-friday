import type { TSESLint } from "@typescript-eslint/utils";

import booleanNaming from "./boolean-naming.js";
import constantCase from "./constant-case.js";
import hookFilename from "./hook-filename.js";
import hookNaming from "./hook-naming.js";
import propertiesSuffix from "./properties-suffix.js";
import preferReadonlyComponentProperties from "./prefer-readonly-component-properties.js";
import renderNaming from "./render-naming.js";
import noMisleadingServicePrefix from "./no-misleading-service-prefix.js";
import sortDestructuring from "./sort-destructuring.js";
import testFilename from "./test-filename.js";
import typeDeclarationOrder from "./type-declaration-order.js";
import indexExportOnly from "./index-export-only.js";
import jsxNewlineBetweenElements from "./jsx-newline-between-elements.js";
import jsxNoDataArray from "./jsx-no-data-array.js";
import jsxNoDataObject from "./jsx-no-data-object.js";
import jsxNoNewlineSingleLineElements from "./jsx-no-newline-single-line-elements.js";
import jsxNoNonComponentFunction from "./jsx-no-non-component-function.js";
import jsxNoSubInterface from "./jsx-no-sub-interface.js";
import jsxRequireSuspense from "./jsx-require-suspense.js";
import jsxSimpleProperties from "./jsx-simple-properties.js";
import jsxSortProperties from "./jsx-sort-properties.js";
import jsxSpreadPropertiesLast from "./jsx-spread-properties-last.js";
import noComplexInlineReturn from "./no-complex-inline-return.js";
import noDirectDate from "./no-direct-date.js";
import noEmoji from "./no-emoji.js";
import noEnvironmentFallback from "./no-environment-fallback.js";
import noGhostWrapper from "./no-ghost-wrapper.js";
import noInlineNestedObject from "./no-inline-nested-object.js";
import noInlineReturnProperties from "./no-inline-return-properties.js";
import noLazyIdentifiers from "./no-lazy-identifiers.js";
import noLogicInParameters from "./no-logic-in-parameters.js";
import noMagicNumbers from "./no-magic-numbers.js";
import noMisleadingConstantCase from "./no-misleading-constant-case.js";
import noNestedInterfaceDeclaration from "./no-nested-interface-declaration.js";
import preferDestructuringParameters from "./prefer-destructuring-parameters.js";
import preferGuardClause from "./prefer-guard-clause.js";
import preferInlineLiteralUnion from "./prefer-inline-literal-union.js";
import preferInterfaceForComponentProperties from "./prefer-interface-for-component-properties.js";
import preferInterfaceOverInlineTypes from "./prefer-interface-over-inline-types.js";
import preferNamedParameterTypes from "./prefer-named-parameter-types.js";
import preferPropertiesWithChildren from "./prefer-properties-with-children.js";
import preferReactImportTypes from "./prefer-react-import-types.js";
import sortExports from "./sort-exports.js";
import sortImports from "./sort-imports.js";
import sortTypeAlphabetically from "./sort-type-alphabetically.js";
import sortTypeRequiredFirst from "./sort-type-required-first.js";

export const rules = {
  "boolean-naming": booleanNaming,
  "constant-case": constantCase,
  "hook-filename": hookFilename,
  "hook-naming": hookNaming,
  "properties-suffix": propertiesSuffix,
  "prefer-readonly-component-properties": preferReadonlyComponentProperties,
  "render-naming": renderNaming,
  "no-misleading-service-prefix": noMisleadingServicePrefix,
  "sort-destructuring": sortDestructuring,
  "test-filename": testFilename,
  "type-declaration-order": typeDeclarationOrder,
  "index-export-only": indexExportOnly,
  "jsx-newline-between-elements": jsxNewlineBetweenElements,
  "jsx-no-data-array": jsxNoDataArray,
  "jsx-no-data-object": jsxNoDataObject,
  "jsx-no-newline-single-line-elements": jsxNoNewlineSingleLineElements,
  "jsx-no-non-component-function": jsxNoNonComponentFunction,
  "jsx-no-sub-interface": jsxNoSubInterface,
  "jsx-require-suspense": jsxRequireSuspense,
  "jsx-simple-properties": jsxSimpleProperties,
  "jsx-sort-properties": jsxSortProperties,
  "jsx-spread-properties-last": jsxSpreadPropertiesLast,
  "no-complex-inline-return": noComplexInlineReturn,
  "no-direct-date": noDirectDate,
  "no-emoji": noEmoji,
  "no-environment-fallback": noEnvironmentFallback,
  "no-ghost-wrapper": noGhostWrapper,
  "no-inline-nested-object": noInlineNestedObject,
  "no-inline-return-properties": noInlineReturnProperties,
  "no-lazy-identifiers": noLazyIdentifiers,
  "no-logic-in-parameters": noLogicInParameters,
  "no-magic-numbers": noMagicNumbers,
  "no-misleading-constant-case": noMisleadingConstantCase,
  "no-nested-interface-declaration": noNestedInterfaceDeclaration,
  "prefer-destructuring-parameters": preferDestructuringParameters,
  "prefer-guard-clause": preferGuardClause,
  "prefer-inline-literal-union": preferInlineLiteralUnion,
  "prefer-interface-for-component-properties":
    preferInterfaceForComponentProperties,
  "prefer-interface-over-inline-types": preferInterfaceOverInlineTypes,
  "prefer-named-parameter-types": preferNamedParameterTypes,
  "prefer-properties-with-children": preferPropertiesWithChildren,
  "prefer-react-import-types": preferReactImportTypes,
  "sort-exports": sortExports,
  "sort-imports": sortImports,
  "sort-type-alphabetically": sortTypeAlphabetically,
  "sort-type-required-first": sortTypeRequiredFirst,
} satisfies Record<string, TSESLint.RuleModule<string, readonly unknown[]>>;
