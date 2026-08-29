import { BinaryTreeTraceVisualizer } from "../../shared/components/BinaryTreeTraceVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title, type MergeTreesInput } from "./data";
import { createMergeTreesDryRun, type MergeTreesFrame } from "./dryRun";

export default function MergeTreesVisualizer(props: VisualizerProps) {
  return <BinaryTreeTraceVisualizer<MergeTreesInput, MergeTreesFrame>
    {...props}
    title={title}
    examples={examples}
    codeLines={codeLines}
    heading="Merged output tree"
    inputLabel="root1 and root2 JSON"
    errorMessage='Use {"root1":[1,3,2,5],"root2":[2,1,3,null,4,null,7]}.'
    parseInput={(value) => {
      const input = value as Partial<MergeTreesInput>;
      return Array.isArray(input?.root1) && Array.isArray(input?.root2) && [...input.root1, ...input.root2].every((node) => node === null || typeof node === "number") ? { root1: input.root1, root2: input.root2 } : null;
    }}
    createRun={(input) => createMergeTreesDryRun(input.root1, input.root2)}
    getActiveValues={(frame) => frame.phase === "done" || frame.mergedValue === null ? [] : [frame.mergedValue]}
    getCompletedValues={(frame) => frame.tree.filter((value): value is number => typeof value === "number")}
    renderState={(frame) => <div className="state-block"><h3>merge state</h3><div className="token-list"><span>root1 = {frame.firstValue ?? "None"}</span><span>root2 = {frame.secondValue ?? "None"}</span><span>output = {frame.mergedValue ?? "None"}</span></div></div>}
  />;
}
