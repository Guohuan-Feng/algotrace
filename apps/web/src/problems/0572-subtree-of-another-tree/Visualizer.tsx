import { BinaryTreeTraceVisualizer } from "../../shared/components/BinaryTreeTraceVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title, type SubtreeInput } from "./data";
import { createSubtreeDryRun, type SubtreeFrame } from "./dryRun";

export default function SubtreeVisualizer(props: VisualizerProps) {
  return <BinaryTreeTraceVisualizer<SubtreeInput, SubtreeFrame>
    {...props}
    title={title}
    examples={examples}
    codeLines={codeLines}
    heading="Candidate roots in the main tree"
    inputLabel="root and subRoot JSON"
    errorMessage='Use {"root":[3,4,5,1,2],"subRoot":[4,1,2]}.'
    parseInput={(value) => {
      const input = value as Partial<SubtreeInput>;
      return Array.isArray(input?.root) && Array.isArray(input?.subRoot) && [...input.root, ...input.subRoot].every((node) => node === null || typeof node === "number") ? { root: input.root, subRoot: input.subRoot } : null;
    }}
    createRun={(input) => createSubtreeDryRun(input.root, input.subRoot)}
    getActiveValues={(frame) => frame.activeRootValue === null ? [] : [frame.activeRootValue]}
    getCompletedValues={(frame) => frame.phase === "match" && frame.activeRootValue !== null ? [frame.activeRootValue] : []}
    renderState={(frame) => <div className="state-block"><h3>comparison state</h3><div className="token-list"><span>candidate = {frame.activeRootValue ?? "None"}</span><span>subRoot value = {frame.comparedValue ?? "None"}</span></div></div>}
  />;
}
