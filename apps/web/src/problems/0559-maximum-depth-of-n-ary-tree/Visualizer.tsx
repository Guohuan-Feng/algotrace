import { NaryTreeTraceVisualizer } from "../../shared/components/NaryTreeTraceVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title } from "./data";
import { createMaximumDepthNaryDryRun, type NaryDepthFrame, type NaryNodeInput } from "./dryRun";

export default function MaximumDepthNaryVisualizer(props: VisualizerProps) {
  return <NaryTreeTraceVisualizer<NaryNodeInput, NaryDepthFrame>
    {...props}
    title={title}
    examples={examples}
    codeLines={codeLines}
    heading="Recursive depth from every child"
    createRun={createMaximumDepthNaryDryRun}
    renderState={(frame) => <div className="state-block"><h3>depth state</h3><div className="token-list"><span>node = {frame.nodeValue ?? "None"}</span><span>current depth = {frame.depth}</span></div></div>}
  />;
}
