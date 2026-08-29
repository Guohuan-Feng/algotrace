import { StringHeapVisualizer, type StringHeapFrame } from "../../shared/components/StringHeapVisualizer";
import { codeLines, defaultExample, examples, title, type LongestHappyStringInput } from "./data";
import { createLongestHappyStringDryRun } from "./dryRun";

export default function LongestHappyStringVisualizer(props: { onBack: () => void }) {
  return <StringHeapVisualizer {...props} title={title} inputLabel="a, b, c counts" examples={examples} defaultExample={defaultExample} codeLines={codeLines} inputToText={JSON.stringify} parseInput={(text) => { const value = JSON.parse(text); if (!value || ![value.a, value.b, value.c].every((item) => Number.isInteger(item) && item >= 0 && item <= 20)) throw new Error(); return value as LongestHappyStringInput; }} inputTokens={(input) => [["a", input.a], ["b", input.b], ["c", input.c]]} createRun={(input) => { const run = createLongestHappyStringDryRun(input.a, input.b, input.c); return { frames: run.frames.map((frame) => ({ ...frame, focusA: frame.first, focusB: frame.second, held: null })) as StringHeapFrame[] }; }} />;
}
