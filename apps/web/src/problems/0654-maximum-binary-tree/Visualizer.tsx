import { BinaryTreeTraceVisualizer } from "../../shared/components/BinaryTreeTraceVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title, type MaximumBinaryTreeInput } from "./data";
import { createMaximumBinaryTreeDryRun, type MaximumBinaryTreeFrame } from "./dryRun";

export default function MaximumBinaryTreeVisualizer(props: VisualizerProps) {
  return <BinaryTreeTraceVisualizer<MaximumBinaryTreeInput, MaximumBinaryTreeFrame>
    {...props}
    title={title}
    examples={examples}
    codeLines={codeLines}
    heading="Tree built from range maxima"
    inputLabel="nums JSON"
    errorMessage='Use {"nums":[3,2,1,6,0,5]}.'
    parseInput={(value) => {
      const input = value as Partial<MaximumBinaryTreeInput>;
      return Array.isArray(input?.nums) && input.nums.every((number) => typeof number === "number" && Number.isFinite(number)) ? { nums: input.nums } : null;
    }}
    createRun={(input) => createMaximumBinaryTreeDryRun(input.nums)}
    getActiveValues={(frame) => frame.phase === "done" || frame.chosenValue === null ? [] : [frame.chosenValue]}
    getCompletedValues={(frame) => frame.tree.filter((value): value is number => typeof value === "number")}
    renderState={(frame) => <div className="state-block"><h3>range state</h3><div className="token-list"><span>range = [{frame.range.join(", ")}]</span><span>scan index = {frame.scanIndex ?? "None"}</span><span>maximum = {frame.chosenValue ?? "None"}</span></div></div>}
  />;
}
