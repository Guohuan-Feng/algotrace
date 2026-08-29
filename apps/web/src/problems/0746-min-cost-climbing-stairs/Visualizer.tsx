import { LinearDpVisualizer } from "../../shared/components/LinearDpVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createMinCostClimbingStairsDryRun } from "./dryRun";

export default function MinCostClimbingStairsVisualizer(props: VisualizerProps) {
  return <LinearDpVisualizer {...props} title={title} stageTitle="Minimum-Cost DP" inputLabel="input JSON" codeLines={codeLines} examples={examples} defaultExample={defaultExample} createDryRun={(input) => createMinCostClimbingStairsDryRun(input.cost)} inputSummary={(input) => `cost = [${input.cost.join(", ")}]`} />;
}
