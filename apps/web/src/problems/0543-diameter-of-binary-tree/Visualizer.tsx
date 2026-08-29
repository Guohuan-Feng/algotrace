import { TreeTraceVisualizer } from "../../shared/components/TreeTraceVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title } from "./data";
import { createDiameterDryRun, type DiameterFrame } from "./dryRun";
export default function DiameterVisualizer(props: VisualizerProps) { return <TreeTraceVisualizer<DiameterFrame> {...props} title={title} examples={examples} codeLines={codeLines} heading="Postorder height calculation" completionLabel="height known" createRun={createDiameterDryRun} renderState={(frame) => <div className="state-block"><h3>height state</h3><div className="token-list"><span>left height = {frame.leftHeight ?? "-"}</span><span>right height = {frame.rightHeight ?? "-"}</span><span>returned height = {frame.height ?? "-"}</span><span>diameter = {frame.diameter}</span></div></div>} />; }
