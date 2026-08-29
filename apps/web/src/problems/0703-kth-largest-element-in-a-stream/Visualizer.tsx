import { NumericHeapVisualizer, type NumericHeapFrame } from "../../shared/components/NumericHeapVisualizer";
import { codeLines, defaultExample, examples, title, type KthLargestStreamInput } from "./data";
import { createKthLargestStreamDryRun, kthLargestStreamHeapEntries } from "./dryRun";

export default function KthLargestStreamVisualizer(props: { onBack: () => void }) {
  return <NumericHeapVisualizer {...props} title={title} sourceLabel="constructor values, then add calls" heapLabel="Min-Heap of Top k Stream Values" heapCaption="current kth largest at root" outputLabel="add() results" examples={examples} defaultExample={defaultExample} codeLines={codeLines} inputToText={JSON.stringify} parseInput={parseInput} sourceItems={(input) => [...input.nums.map((value) => `seed ${value}`), ...input.adds.map((value) => `add(${value})`)]} createRun={(input) => ({ frames: createKthLargestStreamDryRun(input.k, input.nums, input.adds).frames.map((frame) => ({ kind: frame.kind, phase: frame.phase, title: frame.title, detail: frame.detail, activeLines: frame.activeLines, heap: kthLargestStreamHeapEntries(frame.heap), sourceIndex: frame.sourceIndex, currentLabel: frame.current === null ? null : String(frame.current), removedLabel: frame.popped === null ? null : String(frame.popped), output: frame.result })) as NumericHeapFrame[] })} />;
}

function parseInput(text: string): KthLargestStreamInput {
  const input = JSON.parse(text) as KthLargestStreamInput;
  if (!Number.isInteger(input.k) || input.k < 1 || !Array.isArray(input.nums) || !Array.isArray(input.adds) || !input.nums.every(Number.isFinite) || !input.adds.every(Number.isFinite)) throw new Error();
  return input;
}
