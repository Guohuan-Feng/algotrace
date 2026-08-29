import { NumericHeapVisualizer, type NumericHeapFrame } from "../../shared/components/NumericHeapVisualizer";
import { codeLines, defaultExample, examples, title, type KClosestInput } from "./data";
import { createKClosestDryRun, kClosestHeapEntries, pointLabel } from "./dryRun";

export default function KClosestVisualizer(props: { onBack: () => void }) {
  return <NumericHeapVisualizer {...props} title={title} sourceLabel="points" heapLabel="Max-Heap of Closest Candidates" heapCaption="negative squared distance first" outputLabel="closest points" examples={examples} defaultExample={defaultExample} codeLines={codeLines} inputToText={JSON.stringify} parseInput={parseInput} sourceItems={(input) => input.points.map((point) => `(${point.join(", ")})`)} createRun={(input) => ({ frames: createKClosestDryRun(input.points, input.k).frames.map((frame) => ({ kind: frame.kind, phase: frame.phase, title: frame.title, detail: frame.detail, activeLines: frame.activeLines, heap: kClosestHeapEntries(frame.heap), sourceIndex: frame.sourceIndex, currentLabel: frame.current ? pointLabel(frame.current) : null, removedLabel: frame.popped ? pointLabel(frame.popped) : null, output: frame.result })) as NumericHeapFrame[] })} />;
}

function parseInput(text: string): KClosestInput {
  const input = JSON.parse(text) as KClosestInput;
  if (!Array.isArray(input.points) || !input.points.length || !input.points.every((point) => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite)) || !Number.isInteger(input.k) || input.k < 1 || input.k > input.points.length) throw new Error();
  return input;
}
