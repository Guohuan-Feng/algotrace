import { TreeTraceVisualizer } from "../../shared/components/TreeTraceVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title } from "./data";
import { createBottomLeftDryRun, type BottomLeftFrame } from "./dryRun";
export default function BottomLeftVisualizer(props: VisualizerProps) { return <TreeTraceVisualizer<BottomLeftFrame> {...props} title={title} examples={examples} codeLines={codeLines} heading="Level-order search" completionLabel="processed" createRun={createBottomLeftDryRun} renderState={(frame) => <div className="state-block"><h3>BFS state</h3><div className="token-list"><span>level = {frame.level}</span><span>queue = [{frame.queue.join(", ")}]</span><span>bottom-left = {frame.bottomLeft ?? "-"}</span></div></div>} />; }
