import { LinearDpVisualizer } from "../../shared/components/LinearDpVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createCombinationSumIvDryRun } from "./dryRun";

export default function CombinationSumIvVisualizer(props: VisualizerProps) {
  return <LinearDpVisualizer {...props} title={title} stageTitle="Ordered Combination DP" inputLabel="input JSON" codeLines={codeLines} examples={examples} defaultExample={defaultExample} createDryRun={(input) => createCombinationSumIvDryRun(input.nums, input.target)} inputSummary={(input) => `nums = [${input.nums.join(", ")}], target = ${input.target}`} />;
}
