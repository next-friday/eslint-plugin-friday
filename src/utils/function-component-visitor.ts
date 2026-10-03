import {getFunctionComponentCollector} from "@eslint-react/core";
import type {Rule} from "eslint";

type FunctionComponentCollector = ReturnType<typeof getFunctionComponentCollector>;

type FunctionComponentProgram = Parameters<
  FunctionComponentCollector["api"]["getAllComponents"]
>[0];

type FunctionComponents = ReturnType<FunctionComponentCollector["api"]["getAllComponents"]>;

type ProgramExitHandler = (
  program: FunctionComponentProgram,
  components: FunctionComponents,
) => void;

/**
 * Attach the React component collector to a rule and pass its results on program exit.
 * @param context ESLint rule context.
 * @param onProgramExit Rule-specific check for the program and detected components.
 * @returns The collector's visitors and the program exit handler.
 */
export function createFunctionComponentVisitor(
  context: Rule.RuleContext,
  onProgramExit: ProgramExitHandler,
): Rule.RuleListener {
  const collector = getFunctionComponentCollector(
    context as unknown as Parameters<typeof getFunctionComponentCollector>[0],
  );

  return {
    ...collector.visitor,
    "Program:exit": node => {
      const program = node as Parameters<typeof collector.api.getAllComponents>[0];

      onProgramExit(program, collector.api.getAllComponents(program));
    },
  } as Rule.RuleListener;
}
