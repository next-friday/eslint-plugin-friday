import type {ESLint} from "eslint";

import {meta} from "./meta";
import {componentDefinitionStyle} from "./rules/component-definition-style";
import {componentEntrypoint} from "./rules/component-entrypoint";
import {componentModule} from "./rules/component-module";
import {indexExportOnly} from "./rules/index-export-only";
import {jsxNewlineBetweenElements} from "./rules/jsx-newline-between-elements";
import {jsxNoNewlineSingleLineElements} from "./rules/jsx-no-newline-single-line-elements";
import {namedProps} from "./rules/named-props";
import {noLazyIdentifiers} from "./rules/no-lazy-identifiers";
import {objectCurlyNewline} from "./rules/object-curly-newline";
import {propsInBody} from "./rules/props-in-body";

const plugin = {
  meta,
  rules: {
    "component-definition-style": componentDefinitionStyle,
    "component-entrypoint": componentEntrypoint,
    "component-module": componentModule,
    "index-export-only": indexExportOnly,
    "jsx-newline-between-elements": jsxNewlineBetweenElements,
    "jsx-no-newline-single-line-elements": jsxNoNewlineSingleLineElements,
    "named-props": namedProps,
    "no-lazy-identifiers": noLazyIdentifiers,
    "object-curly-newline": objectCurlyNewline,
    "props-in-body": propsInBody,
  },
} satisfies ESLint.Plugin;

export default plugin;
