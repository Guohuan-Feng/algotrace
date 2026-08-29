import { LinearDpVisualizer } from "../../shared/components/LinearDpVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createPartitionEqualSubsetSumDryRun } from "./dryRun";

export default function PartitionEqualSubsetSumVisualizer(props: VisualizerProps) {
  return <LinearDpVisualizer {...props} title={title} stageTitle="0/1 Knapsack DP" inputLabel="input JSON" codeLines={codeLines} examples={examples} defaultExample={defaultExample} createDryRun={(input) => createPartitionEqualSubsetSumDryRun(input.nums)} inputSummary={(input) => `nums = [${input.nums.join(", ")}]`} />;
}
