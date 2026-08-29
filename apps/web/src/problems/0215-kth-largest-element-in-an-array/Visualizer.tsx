import { NumericHeapVisualizer, type NumericHeapFrame } from "../../shared/components/NumericHeapVisualizer";
import { codeLines, defaultExample, examples, title, type KthLargestInput } from "./data";
import { createKthLargestDryRun, kthLargestHeapEntries } from "./dryRun";

export default function KthLargestVisualizer(props: { onBack: () => void }) {
  return <NumericHeapVisualizer {...props} title={title} sourceLabel="nums" heapLabel="Min-Heap of Top k Values" heapCaption="smallest retained value first" outputLabel="kth largest" examples={examples} defaultExample={defaultExample} codeLines={codeLines} inputToText={JSON.stringify} parseInput={parseInput} sourceItems={(input) => input.nums.map(String)} createRun={(input) => ({ frames: createKthLargestDryRun(input.nums, input.k).frames.map((frame) => ({ kind: frame.kind, phase: frame.phase, title: frame.title, detail: frame.detail, activeLines: frame.activeLines, heap: kthLargestHeapEntries(frame.heap), sourceIndex: frame.sourceIndex, currentLabel: frame.current === null ? null : String(frame.current), removedLabel: frame.popped === null ? null : String(frame.popped), output: frame.result })) as NumericHeapFrame[] })} />;
}

function parseInput(text: string): KthLargestInput {
  const input = JSON.parse(text) as KthLargestInput;
  if (!Array.isArray(input.nums) || !input.nums.length || !input.nums.every(Number.isFinite) || !Number.isInteger(input.k) || input.k < 1 || input.k > input.nums.length) throw new Error();
  return input;
}
