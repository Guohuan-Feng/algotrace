import { KSumVisualizer } from "../../shared/components/KSumVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createThreeSumDryRun } from "./dryRun";

export default function ThreeSumVisualizer(props: VisualizerProps) {
  return <KSumVisualizer {...props} codeLines={codeLines} createDryRun={(input) => createThreeSumDryRun(input.nums)} defaultExample={defaultExample} examples={examples} k={3} title={title} />;
}
