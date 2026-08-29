import { TreeTraceVisualizer } from "../../shared/components/TreeTraceVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title } from "./data";
import { createMinimumDifferenceDryRun, type MinimumDifferenceFrame } from "./dryRun";
export default function MinimumDifferenceVisualizer(props: VisualizerProps) { return <TreeTraceVisualizer<MinimumDifferenceFrame> {...props} title={title} examples={examples} codeLines={codeLines} heading="Sorted inorder neighbors" completionLabel="compared" createRun={createMinimumDifferenceDryRun} renderState={(frame) => <div className="state-block"><h3>difference state</h3><div className="token-list"><span>prev = {frame.previous ?? "None"}</span><span>current diff = {frame.diff ?? "-"}</span><span>minimum = {frame.minimum ?? "∞"}</span></div></div>} />; }
