import { KSumVisualizer } from "../../shared/components/KSumVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createFourSumDryRun } from "./dryRun";

export default function FourSumVisualizer(props: VisualizerProps) {
  return <KSumVisualizer {...props} codeLines={codeLines} createDryRun={(input) => createFourSumDryRun(input.nums, input.target ?? 0)} defaultExample={defaultExample} examples={examples} k={4} title={title} />;
}
