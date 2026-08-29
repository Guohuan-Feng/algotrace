import { LinearDpVisualizer } from "../../shared/components/LinearDpVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createClimbingStairsDryRun } from "./dryRun";

export default function ClimbingStairsVisualizer(props: VisualizerProps) {
  return <LinearDpVisualizer {...props} title={title} stageTitle="Ways-to-Climb DP" inputLabel="input JSON" codeLines={codeLines} examples={examples} defaultExample={defaultExample} createDryRun={(input) => createClimbingStairsDryRun(input.n)} inputSummary={(input) => `n = ${input.n}`} />;
}
