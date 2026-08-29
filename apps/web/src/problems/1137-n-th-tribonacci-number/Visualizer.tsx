import { LinearDpVisualizer } from "../../shared/components/LinearDpVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createTribonacciDryRun } from "./dryRun";

export default function TribonacciVisualizer(props: VisualizerProps) {
  return <LinearDpVisualizer {...props} title={title} stageTitle="Three-State DP" inputLabel="input JSON" codeLines={codeLines} examples={examples} defaultExample={defaultExample} createDryRun={(input) => createTribonacciDryRun(input.n)} inputSummary={(input) => `n = ${input.n}`} />;
}
