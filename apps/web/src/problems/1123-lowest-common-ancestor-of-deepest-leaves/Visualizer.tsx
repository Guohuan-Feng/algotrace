import { TreeTraceVisualizer } from "../../shared/components/TreeTraceVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title } from "./data";
import { createLcaDeepestLeavesDryRun, type LcaDeepestFrame } from "./dryRun";

export default function LcaDeepestLeavesVisualizer(props: VisualizerProps) {
  return <TreeTraceVisualizer<LcaDeepestFrame>
    {...props}
    title={title}
    examples={examples}
    codeLines={codeLines}
    heading="Postorder depth comparison"
    completionLabel="returned"
    createRun={createLcaDeepestLeavesDryRun}
    renderState={(frame) => <div className="state-block"><h3>deepest-leaf state</h3><div className="token-list"><span>deepest depth = {frame.depth}</span><span>current LCA = {frame.lcaValue ?? "None"}</span></div></div>}
  />;
}
