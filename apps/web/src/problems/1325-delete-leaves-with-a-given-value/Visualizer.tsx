import { BinaryTreeTraceVisualizer } from "../../shared/components/BinaryTreeTraceVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title, type RemoveLeafInput } from "./data";
import { createRemoveLeafNodesDryRun, type RemoveLeafFrame } from "./dryRun";

export default function DeleteLeavesVisualizer(props: VisualizerProps) {
  return <BinaryTreeTraceVisualizer<RemoveLeafInput, RemoveLeafFrame>
    {...props}
    title={title}
    examples={examples}
    codeLines={codeLines}
    heading="Postorder leaf pruning"
    inputLabel="root and target JSON"
    errorMessage='Use {"root":[1,2,3,2,null,2,4],"target":2}.'
    parseInput={(value) => {
      const input = value as Partial<RemoveLeafInput>;
      return Array.isArray(input?.root) && typeof input.target === "number" && input.root.every((node) => node === null || typeof node === "number") ? { root: input.root, target: input.target } : null;
    }}
    createRun={(input) => createRemoveLeafNodesDryRun(input.root, input.target)}
    getActiveValues={(frame) => frame.activeValue === null ? [] : [frame.activeValue]}
    getCompletedValues={(frame) => frame.phase === "done" ? frame.tree.filter((value): value is number => typeof value === "number") : []}
    renderState={(frame) => <div className="state-block"><h3>pruning state</h3><div className="token-list"><span>target = {frame.target}</span><span>current node = {frame.activeValue ?? "None"}</span></div></div>}
  />;
}
