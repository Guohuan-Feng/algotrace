import { LinearDpVisualizer } from "../../shared/components/LinearDpVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createPerfectSquaresDryRun } from "./dryRun";

export default function PerfectSquaresVisualizer(props: VisualizerProps) {
  return <LinearDpVisualizer {...props} title={title} stageTitle="Complete Knapsack DP" inputLabel="input JSON" codeLines={codeLines} examples={examples} defaultExample={defaultExample} createDryRun={(input) => createPerfectSquaresDryRun(input.n)} inputSummary={(input) => `n = ${input.n}`} />;
}
