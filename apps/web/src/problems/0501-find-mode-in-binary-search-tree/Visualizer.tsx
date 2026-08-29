import { TreeTraceVisualizer } from "../../shared/components/TreeTraceVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title } from "./data";
import { createFindModeDryRun, type FindModeFrame } from "./dryRun";
export default function FindModeVisualizer(props: VisualizerProps) { return <TreeTraceVisualizer<FindModeFrame> {...props} title={title} examples={examples} codeLines={codeLines} heading="Inorder frequency runs" completionLabel="counted" createRun={createFindModeDryRun} renderState={(frame) => <div className="state-block"><h3>frequency state</h3><div className="token-list"><span>prev = {frame.previous ?? "None"}</span><span>count = {frame.count}</span><span>max_count = {frame.maxCount}</span><span>modes = [{frame.modes.join(", ")}]</span></div></div>} />; }
