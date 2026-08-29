import { LinearDpVisualizer } from "../../shared/components/LinearDpVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createWordBreakDryRun } from "./dryRun";

export default function WordBreakVisualizer(props: VisualizerProps) {
  return <LinearDpVisualizer {...props} title={title} stageTitle="Prefix Segmentation DP" inputLabel="input JSON" codeLines={codeLines} examples={examples} defaultExample={defaultExample} createDryRun={(input) => createWordBreakDryRun(input.s, input.wordDict)} inputSummary={(input) => `s = "${input.s}"`} />;
}
